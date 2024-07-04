import React, { useEffect, useRef, useState } from "react";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import { toast } from "sonner";

import { Report } from "@/plugins/reports/types";
import { Chat } from "@/plugins/reports/hooks/use-chat";
import {
    generateContentFromOutlines,
    generateContentFromRequirements,
} from "@/plugins/reports/utils/generateEditorContent";
import { mediaIdsFromFiles } from "@/plugins/files/utils";

export type CollaboraPostMessage = {
    MessageId: string;
    SendTime?: string | number;
    Values?: { [key: string]: string | number | boolean | null | undefined | object }; // any key-value pair
    ScriptFile?: string;
    Function?: string;
};

export type AiContentResponse = {
    content: string | null;
    isRendered: boolean;
    error: boolean;
};

export interface CollaboraExports {
    wopiUrl: string;
    zebraMode: string;
    setZebraMode: React.Dispatch<React.SetStateAction<string>>;
    documentLoaded: boolean;
    sendMessage: (message: CollaboraPostMessage) => void;
    startLoading: boolean;
    fetchSelectedText: () => Promise<string | undefined>;
    fetchSelectedCells: () => Promise<Object | undefined>;
    insertCells: () => void;
    insertText: (text: string, selectInsertedText?: boolean) => void;
    insertCustomHtml: (htmlContent: string) => void;
    undo: () => void;
    redo: () => void;
    goToDocumentEnd: () => void;
}

interface PendingRequest {
    timestamp: number;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}

export function useCollabora({
    iframeRef,
    selectedReport,
    chat,
    showSidebar,
    setShowSidebar,
    onCloseEditor,
    onDocumentLoadFailed,
    isAiLoading,
    setIsAiLoading,
    currentUser,
    allUsers,
}: {
    iframeRef: React.MutableRefObject<HTMLIFrameElement | null>;
    selectedReport: Report;
    chat: Chat;
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    onCloseEditor: () => void;
    onDocumentLoadFailed: () => void;
    isAiLoading: boolean;
    setIsAiLoading: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: string;
    allUsers: string[];
}): CollaboraExports {
    const [wopiUrl, setWopiUrl] = useState("");
    const [documentLoaded, setDocumentLoaded] = useState(false);
    const [zebraMode, setZebraMode] = useState<"chat" | "db" | "doc">("chat");
    const [startLoading, setStartLoading] = useState(false);
    const pendingRequests = useRef<PendingRequest[]>([]);

    // State to ensure content generation is not triggered multiple times
    const fetchCount = useRef(0);
    // State for storing content generation responses
    const contentQueue = useRef<AiContentResponse[]>([]);
    // State for tracking currently rendered content
    const renderIndex = useRef(0);

    useEffect(() => {
        const initializeEditorIframe = (): void => {
            const accessToken = {
                origin: window.location.origin,
                userId: currentUser,
            };
            const accessTokenJsonString = JSON.stringify(accessToken);
            const wopiSrc = `${SettingsStore.getValue("wopiSrc")}/wopi/files/${selectedReport.id}`;
            fetch(`${SettingsStore.getValue("reportsApiUrl")}/wopi/get_editor_url`)
                .then((response) => response.json())
                .then((data) => {
                    const wopiClientUrl = data.url;
                    const wopi = `${wopiClientUrl}WOPISrc=${encodeURIComponent(wopiSrc)}`;
                    setWopiUrl(`${wopi}&access_token=${encodeURIComponent(accessTokenJsonString)}`);
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
    }, [iframeRef]); // eslint-disable-line react-hooks/exhaustive-deps

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

        // console.log(`R: ${msg.MessageId}`, msg);

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

    const handleUnpromptedMessages = async (msg: CollaboraPostMessage): Promise<void> => {
        if (!msg.Values) return;
        switch (msg.MessageId) {
            case "App_LoadingStatus":
                {
                    if (msg.Values.Status && msg.Values.Status == "Document_Loaded") {
                        sendMessage({ MessageId: "Host_PostmessageReady" });
                        setDocumentLoaded(true);
                        if (selectedReport.fileType === "docx" || selectedReport.fileType === "doc") {
                            defaultUiUpdates();
                        }
                        if (selectedReport.aiContent) {
                            if (
                                selectedReport.aiContent.requirementDocuments &&
                                selectedReport.aiContent.requirementDocuments.length > 0
                            ) {
                                await aiGenerateContentFromRequirements();
                            } else {
                                await aiGenerateContentFromOutlines();
                            }
                        }
                    }
                }
                break;
            case "Action_Load_Resp":
                {
                    if (!msg.Values.success) {
                        onDocumentLoadFailed();
                    }
                }
                break;
            case "Clicked_Button":
                {
                    const buttonId: string = (msg.Values.Id as string) ?? "";
                    if (buttonId && buttonId === "custom_exit_editor") {
                        sendMessage({ MessageId: "Action_Save", Values: { DontSaveIfUnmodified: true } });
                        sendMessage({ MessageId: "Action_Close" });
                        onCloseEditor();
                    } else if (
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

            case "UI_Mention": {
                const usersList = allUsers.map((user) => ({
                    username: user.split(":")[0].substring(1),
                    profile: user,
                }));
                const type = msg.Values.type;
                const text = msg.Values.text as string;
                const users = usersList.filter((user) => user.username.includes(text));
                if (type === "autocomplete") {
                    setTimeout(sendMessage, 0, {
                        MessageId: "Action_Mention",
                        SendTime: Date.now(),
                        Values: {
                            list: users,
                        },
                    });
                } else if (type === "selected") {
                    // TODO: Implement user tagging
                    // console.log(`Mentioned:`, msg.Values.username);
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
        // console.log(`S: ${message.MessageId}`, message);
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
        sendMessage({
            MessageId: "Insert_Button",
            Values: {
                id: "custom_exit_editor",
                imgurl: `${window.location.origin}/img/close-editor.svg`,
                hint: "Close Document",
                mobile: true,
                tablet: true,
                label: "Close Document",
                insertBefore: "sidebar",
            },
        });
        sendMessage({
            MessageId: "Insert_Button",
            Values: {
                id: "custom_toggle_zebra",
                imgurl: `${window.location.origin}/img/zebra.svg`,
                hint: "Zebra Chat",
                mobile: true,
                tablet: true,
                label: "Zebra Chat",
                insertBefore: "sidebar",
            },
        });
        sendMessage({
            MessageId: "Insert_Button",
            Values: {
                id: "custom_toggle_doc_query",
                imgurl: `${window.location.origin}/img/ai-writer.svg`,
                hint: "AI Writer",
                mobile: true,
                tablet: true,
                label: "AI Writer",
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

    const fetchSelectedCells = async (): Promise<Object | undefined> => {
        const response = await sendMessage(
            {
                MessageId: "CallPythonScript",
                ScriptFile: "GetSelectedCellsContent.py", // Ensure this Python script is deployed on the server
                Function: "GetSelectedCellsContent",
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

    const insertCells = (): void => {
        sendMessage(
            {
                MessageId: "CallPythonScript",
                ScriptFile: "InsertCell.py", // Ensure this Python script is deployed on the server
                Function: "insertContentIntoCells",
            },
            false,
        );
    };

    const insertText = (text: string, selectInsertedText: boolean = false): void => {
        sendMessage({
            MessageId: "CallPythonScript",
            SendTime: Date.now(),
            ScriptFile: "InsertText.py", // Ensure this Python script is deployed on the server
            Function: "InsertText",
            Values: {
                text: { type: "string", value: text },
                selectInsertedText: { type: "boolean", value: selectInsertedText },
            },
        });
    };

    const insertCustomHtml = (htmlContent: string): void => {
        sendMessage({
            MessageId: "Action_Paste",
            SendTime: Date.now(),
            Values: { Mimetype: "text/html", Data: htmlContent },
        });
    };

    const goToDocumentEnd = (): void => {
        // .uno:ClearUndoStack
        sendMessage({
            MessageId: "Send_UNO_Command",
            SendTime: Date.now(),
            Values: { Command: ".uno:GoToEndOfDoc" },
        });
    };
    const undo = (): void => {
        // .uno:ClearUndoStack
        sendMessage({
            MessageId: "Send_UNO_Command",
            SendTime: Date.now(),
            Values: { Command: ".uno:Undo" },
        });
    };
    const redo = (): void => {
        // .uno:ClearUndoStack
        sendMessage({
            MessageId: "Send_UNO_Command",
            SendTime: Date.now(),
            Values: { Command: ".uno:Redo" },
        });
    };

    const aiGenerateContentFromRequirements = async (): Promise<void> => {
        if (!selectedReport.aiContent || !selectedReport.aiContent.requirementDocuments) return;
        setIsAiLoading(true);
        const requirementMediaIds = mediaIdsFromFiles(selectedReport.aiContent.requirementDocuments);
        let supportingMediaIds;
        if (selectedReport.aiContent.supportingDocuments) {
            supportingMediaIds = mediaIdsFromFiles(selectedReport.aiContent.supportingDocuments);
        }
        const generatedMarkdownContent = await generateContentFromRequirements(
            requirementMediaIds.join(","),
            supportingMediaIds ? supportingMediaIds.join(",") : "",
            currentUser,
        );
        setIsAiLoading(false);
        if (generatedMarkdownContent) {
            goToDocumentEnd();
            // Insert html formatted content
            unified()
                .use(remarkParse)
                .use(remarkHtml)
                .process(generatedMarkdownContent)
                .then((file) => {
                    insertCustomHtml(String(file));
                })
                .catch((error) => {
                    console.error(error);
                    toast.error("Report generation failed. Please try again later.");
                });
        } else {
            toast.error("Report generation failed. Please try again later.");
        }
    };

    const aiGenerateContentFromOutlines = async (): Promise<void> => {
        if (!selectedReport.aiContent) return;
        let interval: ReturnType<typeof setInterval>;

        const processContentSequentially = async (): Promise<void> => {
            if (selectedReport.aiContent && renderIndex.current >= selectedReport.aiContent.allTitles.length) {
                clearTimeout(interval); // Clear when all content is processed
                setIsAiLoading(false);
                return;
            }

            const currentContent = contentQueue.current[renderIndex.current];

            if (currentContent && !currentContent.isRendered) {
                if (currentContent.error) {
                    console.error(`Skipping index ${renderIndex.current} due to fetch error.`);
                    renderIndex.current += 1; // Optionally, you could retry instead of skipping
                } else if (currentContent.content) {
                    // Await here ensures we don't move to the next content until this one is fully processed
                    // await streamContent(currentContent.content, contentBuffer, insertText);
                    insertCustomHtml(currentContent.content);
                    contentQueue.current[renderIndex.current].isRendered = true;
                    renderIndex.current += 1; // Move to the next response
                }
            }

            // Schedule the next check. Adjust the delay as needed.
            interval = setTimeout(processContentSequentially, 1000);
        };

        // if (selectedReport.aiContent && editor && fetchCount.current < 1 && editor.isEmpty) {
        if (selectedReport.aiContent && fetchCount.current < 1) {
            fetchCount.current += 1;
            setIsAiLoading(true);
            selectedReport.aiContent.allTitles.forEach((title, index) => {
                selectedReport.aiContent &&
                    generateContentFromOutlines(
                        selectedReport.aiContent.documentPrompt,
                        title,
                        selectedReport.aiContent.allTitles,
                        selectedReport.aiContent.contentSize,
                        selectedReport.aiContent.targetAudience,
                        selectedReport.aiContent.tone,
                        selectedReport.aiContent.supportingDocuments
                            ? mediaIdsFromFiles(selectedReport.aiContent.supportingDocuments)
                            : undefined,
                    )
                        .then(async (data) => {
                            if (!data) {
                                console.error("No data received");
                                setIsAiLoading(false);
                                return;
                            }
                            contentQueue.current[index] = {
                                content: data,
                                isRendered: false,
                                error: false,
                            };
                            if (index === 0) {
                                // setIsAiLoading(false);
                                // Start the sequential processing with the first received response
                                goToDocumentEnd();
                                processContentSequentially();
                            }
                        })
                        .catch((err) => {
                            contentQueue.current[index] = {
                                content: null,
                                isRendered: false,
                                error: true,
                            };
                            console.error(err);
                            setIsAiLoading(false);
                        });
            });
        }
    };

    return {
        wopiUrl,
        zebraMode,
        setZebraMode,
        documentLoaded,
        sendMessage,
        startLoading,
        fetchSelectedText,
        fetchSelectedCells,
        insertCells,
        insertText,
        insertCustomHtml,
        undo,
        redo,
        goToDocumentEnd,
    } as CollaboraExports;
}
