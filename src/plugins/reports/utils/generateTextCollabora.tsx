import React from "react";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { Chat } from "@/plugins/reports/hooks/use-chat";
import { CollaboraExports } from "@/plugins/reports/hooks/useCollabora";
import { ResponseActionCollabora } from "@/components/reports/Chat/response-action-collabora";

export const generateText = async (
    task: string,
    textSelection: string | undefined,
    editorChat: Chat,
    editor: CollaboraExports,
    tone?: string,
): Promise<void> => {
    // If to-from range is still empty after selecting parent node
    if (!textSelection || textSelection.length === 0) {
        // toast.error("Please select some text and try again.");
        await editorChat.appendMessage(
            "Please select some text and try again.",
            "system",
            false,
            null,
            false,
            false,
            true,
        );
        return;
    }

    // Text selection successfull, append task to chat
    await editorChat.appendMessage(
        `${task}: "${textSelection.slice(0, 20)}..."`,
        "user",
        false,
        null,
        false,
        false,
        true,
    );

    // Generate text from backend
    try {
        const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/text`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: textSelection,
                task,
                tone: tone || "",
            }),
        });

        if (!res.body) {
            throw new Error("No ReadableStream received");
        }

        const reader: ReadableStreamDefaultReader = res.body.getReader();

        const onResponseComplete = (response: string): void => {
            editorChat.setMessages((prev) =>
                prev.map((message, index) => ({
                    ...message,
                    children:
                        index === prev.length - 1 ? (
                            <ResponseActionCollabora
                                editor={editor}
                                originalText={textSelection}
                                responseText={response}
                            />
                        ) : null,
                })),
            );
            editor.insertText(response, true);
        };

        reader &&
            editorChat.processStream(
                reader, // reader
                onResponseComplete, // onComplete
            );
    } catch (errPayload: any) {
        const errorMessage = errPayload?.response?.data?.error;
        const message = errorMessage !== "An error occurred" ? `An error has occured: ${errorMessage}` : errorMessage;
        console.error(message);
    }
};
