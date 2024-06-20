import React, { useEffect, useRef, useState } from "react";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { Chat } from "@/plugins/reports/hooks/use-chat";

export type CollaboraPostMessage = {
    MessageId: string;
    SendTime?: string | number;
    Values?: { [key: string]: string | number | boolean | null | undefined | object }; // any key-value pair
    ScriptFile?: string;
    Function?: string;
};

export interface CollaboraExports {
    wopiUrl: string;
    zebraMode: string;
    setZebraMode: React.Dispatch<React.SetStateAction<string>>;
    documentLoaded: boolean;
    sendMessage: (message: CollaboraPostMessage) => void;
    startLoading: boolean;
    fetchSelectedText: () => Promise<string | undefined>;
    insertTextandSelect: (text: string) => void;
}

interface PendingRequest {
    timestamp: number;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}

export function useCollabora({
    iframeRef,
    fileId,
    chat,
    showSidebar,
    setShowSidebar,
}: {
    iframeRef: React.MutableRefObject<HTMLIFrameElement | null>;
    fileId: string;
    chat: Chat;
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}): CollaboraExports {
    const [wopiUrl, setWopiUrl] = useState("");
    const [documentLoaded, setDocumentLoaded] = useState(false);
    const [zebraMode, setZebraMode] = useState<"chat" | "db" | "doc">("chat");
    const [startLoading, setStartLoading] = useState(false);
    const pendingRequests = useRef<PendingRequest[]>([]);

    useEffect(() => {
        const initializeEditorIframe = (): void => {
            const wopiSrc = `http://fastapi:8000/wopi/files/${fileId}`;
            // const wopiSrc = `http://host.docker.internal:8000/wopi/files/${fileId}`;
            fetch(`${SettingsStore.getValue("reportsApiUrl")}/wopi/get_editor_url`)
                .then((response) => response.json())
                .then((data) => {
                    const wopiClientUrl = data.url;
                    const wopiUrl = `${wopiClientUrl}WOPISrc=${encodeURIComponent(wopiSrc)}`;
                    setWopiUrl(`${wopiUrl}&access_token=${window.location.origin}`);
                    setStartLoading(true);
                });
        };
        // Initialize the iframe
        initializeEditorIframe();

        // Install the message listener.
        window.addEventListener("message", receiveMessage, false);

        return () => {
            window.removeEventListener("message", receiveMessage, false);
        };
    }, [fileId, iframeRef]); // eslint-disable-line react-hooks/exhaustive-deps

    const receiveMessage = (event: MessageEvent): void => {
        if (event.source !== iframeRef.current?.contentWindow || typeof event.data !== "string") return;

        let msg: CollaboraPostMessage;
        try {
            msg = JSON.parse(event.data);
        } catch (e) {
            return;
        }
        if (!msg || !msg.MessageId || !msg.Values) {
            return;
        }

        console.log(`R: ${msg.MessageId}`, msg);

        // Check if message is a script execution response
        if (msg.MessageId === "CallPythonScript-Result") {
            // Process response messages for script executions
            if (pendingRequests.current.length > 0) {
                const request = pendingRequests.current.shift();
                if (request) {
                    request.resolve(msg.Values);
                }
            }
        } else {
            // Handle unprompted messages separately
            handleUnpromptedMessages(msg);
        }
    };

    const handleUnpromptedMessages = (msg: CollaboraPostMessage): void => {
        if (!msg.Values) return;
        switch (msg.MessageId) {
            case "App_LoadingStatus":
                {
                    if (msg.Values.Status && msg.Values.Status == "Document_Loaded") {
                        sendMessage({ MessageId: "Host_PostmessageReady" });
                        setDocumentLoaded(true);
                        defaultUiUpdates();
                    }
                }
                break;
            case "Action_Load_Resp":
                {
                    if (!msg.Values.success) {
                        setDocumentLoaded(false);
                    }
                }
                break;
            case "Clicked_Button":
                {
                    const buttonId: string = (msg.Values.Id as string) ?? "";
                    if (
                        buttonId &&
                        ["custom_toggle_zebra", "custom_toggle_doc_query", "custom_toggle_data_query"].includes(
                            buttonId,
                        )
                    ) {
                        if (!showSidebar) setShowSidebar(true);
                        setZebraMode(() =>
                            buttonId === "custom_toggle_zebra"
                                ? "chat"
                                : buttonId === "custom_toggle_doc_query"
                                  ? "doc"
                                  : "db",
                        );
                    }
                }
                break;
            case "CallPythonScript-Result":
                {
                    if (
                        msg.Values.commandName &&
                        typeof msg.Values.commandName === "string" &&
                        msg.Values.commandName.indexOf("GetSelection") >= 0 &&
                        msg.Values.success &&
                        msg.Values.result &&
                        typeof msg.Values.result === "object" &&
                        "value" in msg.Values.result &&
                        typeof msg.Values.result.value === "string"
                    ) {
                        console.log(`Selected text:`, msg.Values.result.value);
                    }
                }
                break;
            case "UI_Mention": {
                const dummyUserDatabase = [
                    {
                        username: "Abigail",
                        profile: "Abigail profile link",
                    },
                    {
                        username: "Alexandra",
                        profile: "Alexandra profile link",
                    },
                ];
                const type = msg.Values.type;
                const text = msg.Values.text as string;
                const users = dummyUserDatabase.filter((user) => user.username.includes(text));
                if (type === "autocomplete") {
                    setTimeout(sendMessage, 0, {
                        MessageId: "Action_Mention",
                        SendTime: Date.now(),
                        Values: {
                            list: users,
                        },
                    });
                }
                break;
            }
            default:
                break;
        }
    };

    const sendMessage = (message: CollaboraPostMessage, expectResponse = false): Promise<any> | undefined => {
        if (!iframeRef.current) return;
        const timestamp = Date.now();
        console.log(`S: ${message.MessageId}`, message);
        const sendMessage = {
            ...message,
            ...(!message.SendTime && { SendTime: timestamp }),
            ...(!message.Values && { Values: null }),
        };
        iframeRef.current.contentWindow?.postMessage(JSON.stringify(sendMessage), "*");

        if (expectResponse) {
            const promise = new Promise<any>((resolve, reject) => {
                pendingRequests.current.push({ timestamp, resolve, reject });

                // Set a timeout for response
                setTimeout(() => {
                    const index = pendingRequests.current.findIndex((req) => req.timestamp === timestamp);
                    if (index !== -1) {
                        pendingRequests.current.splice(index, 1);
                        reject(new Error("Timeout waiting for response"));
                    }
                }, 3000); // 3 seconds timeout
            });

            return promise;
        }
        return undefined;
    };

    const defaultUiUpdates = (): void => {
        // Change UI mode to compact/classic
        // sendMessage({
        //     MessageId: "Action_ChangeUIMode",
        //     Values: {
        //         Mode: "classic",
        //     },
        // });
        // Hide 'Help' menu item
        sendMessage({
            MessageId: "Hide_Menu_Item",
            Values: {
                id: "help",
            },
        });
        sendMessage({
            MessageId: "Insert_Button",
            Values: {
                id: "custom_toggle_zebra",
                imgurl: `${window.location.origin}/img/zebra.svg`,
                hint: "Zebra Writer",
                mobile: false,
                tablet: true,
                label: "Zebra AI",
                insertBefore: "sidebar",
            },
        });
        sendMessage({
            MessageId: "Insert_Button",
            Values: {
                id: "custom_toggle_doc_query",
                imgurl: `${window.location.origin}/img/doc-query.svg`,
                hint: "AI Doc Query",
                mobile: false,
                tablet: true,
                label: "AI Doc Query",
                insertBefore: "custom_toggle_zebra",
            },
        });
        // Insert custom buttons for Zebra
        sendMessage({
            MessageId: "Insert_Button",
            Values: {
                id: "custom_toggle_data_query",
                imgurl: `${window.location.origin}/img/data-query.svg`,
                hint: "AI Database Query",
                mobile: false,
                tablet: true,
                label: "AI Database Query",
                insertBefore: "custom_toggle_doc_query",
            },
        });
    };

    const fetchSelectedText = async (): Promise<string | undefined> => {
        const response = await sendMessage(
            {
                MessageId: "CallPythonScript",
                ScriptFile: "GetSelection.py", // Ensure this Python script is deployed on the server
                Function: "GetSelection",
            },
            true,
        );
        if (!response.success) {
            throw new Error("Failed to fetch selected text");
        }
        if (response.result.value.length === 0) {
            return undefined;
        } else {
            return response.result.value;
        }
    };

    const insertTextandSelect = (text: string): void => {
        sendMessage({
            MessageId: "CallPythonScript",
            SendTime: Date.now(),
            ScriptFile: "InsertText.py", // Ensure this Python script is deployed on the server
            Function: "InsertText",
            Values: { text: { type: "string", value: text } },
        });
    };

    return {
        wopiUrl,
        zebraMode,
        setZebraMode,
        documentLoaded,
        sendMessage,
        startLoading,
        fetchSelectedText,
        insertTextandSelect,
    } as CollaboraExports;
}
