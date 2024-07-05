import { Extension, Editor } from "@tiptap/core";
import { EditorState, Transaction } from "@tiptap/pm/state";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { reportsStore } from "@/plugins/reports/MainPanel";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        aiTextModify: {
            simplifyText: () => ReturnType;
        };
    }
}

export const AiTextModify = Extension.create({
    name: "AiTextModify",

    addCommands() {
        return {
            simplifyText:
                () =>
                ({
                    tr,
                    editor,
                    state,
                    chain,
                }: {
                    tr: Transaction;
                    editor: Editor;
                    state: EditorState;
                    chain: () => any;
                }): any => {
                    const selectedText: string = editor.state.doc.textBetween(state.selection.from, state.selection.to);
                    const selection = state.selection;
                    // const tr = state.tr;

                    return chain()
                        .fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/text`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                text: selectedText,
                                task: "simplify",
                            }),
                        })
                        .then((res: Response) => {
                            if (!res.body) {
                                throw new Error("No ReadableStream received");
                            }
                            const reader = res.body.getReader();
                            let responseBuffer = "";
                            const decoder = new TextDecoder();

                            // Function to process text from the stream
                            const processText = ({
                                done,
                                value,
                            }: {
                                done: boolean;
                                value?: AllowSharedBufferSource | undefined;
                            }): any => {
                                if (done) {
                                    console.log(`full text: ${responseBuffer}`);
                                    console.log(`state`, state);
                                    selection.replaceWith(tr, state.schema.text(responseBuffer));
                                    return;
                                }
                                responseBuffer += decoder.decode(value);
                                // Continue reading the stream
                                reader
                                    .read()
                                    .then(processText)
                                    .catch((error) => {
                                        console.error("Error while reading the stream:", error);
                                    });
                            };

                            if (reader) {
                                // Start processing the stream
                                reader
                                    .read()
                                    .then(processText)
                                    .catch((error) => {
                                        console.error("Error while starting the stream:", error);
                                    });
                            }
                        })
                        .catch((errPayload: any) => {
                            const errorMessage = errPayload?.response?.data?.error;
                            const message =
                                errorMessage !== "An error occurred"
                                    ? `An error has occurred: ${errorMessage}`
                                    : errorMessage;
                            console.error(message);
                        })
                        .run();
                },
        };
    },
});
