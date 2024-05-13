import React from "react";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { Chat } from "@/plugins/reports/hooks/use-chat";
import { ResponseAction } from "@/components/reports/Chat/response-action";

export const generateText = async (task: string, editor: Editor, editorChat: Chat, tone?: string): Promise<void> => {
    let from: number = editor.state.selection.from;
    let to: number = editor.state.selection.to;
    let textSelection: string = editor.state.doc.textBetween(from, to);

    // No explicit text selection
    if (to === from) {
        editor.commands.selectParentNode();
        from = editor.state.selection.from;
        to = editor.state.selection.to;
        textSelection = editor.state.doc.textBetween(from, to);
        const selection = editor.state.selection.content();
        editor.commands.deleteRange({
            from: from,
            to: to,
        });
        editor.commands.insertContentAt(from, selection.toJSON().content[0]);
    }

    if (textSelection.length === 0) {
        toast.error("Please select some text and try again.");
        return;
    }

    await editorChat.appendMessage(
        `${task}: "${textSelection.slice(0, 20)}..."`,
        "user",
        false,
        null,
        false,
        false,
        true,
    );

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
            // responseText = response
            editor.commands.deleteRange({ from: from, to: to });
            editor.commands.insertContentAt(from, response);
            to = from + response.length + 1;
            // editor.commands.selectParentNode()
            editorChat.setMessages((prev) => {
                return prev.map((message, index) => {
                    if (index === prev.length - 1) {
                        return {
                            ...message,
                            children: (
                                <ResponseAction
                                    fromPos={from}
                                    toPos={to}
                                    response={response}
                                    original={textSelection}
                                    editor={editor}
                                />
                            ),
                        };
                    }
                    return message;
                });
            });
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
