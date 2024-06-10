import { useEditor } from "@tiptap/react";
import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import type { Editor } from "@tiptap/react";
import { AiGenerationContent } from "../types";
import { streamContent, generateContent } from "../utils/generateEditorContent";

import { ExtensionKit } from "@/plugins/reports/extensions/extension-kit";
import { EditorUser } from "@/components/reports/BlockEditor/types";
import { randomElement } from "@/lib/utils";
import { userColors } from "@/lib/constants";

declare global {
    interface Window {
        editor: Editor | null;
    }
}

export type AiContentResponse = {
    content: string | null;
    isRendered: boolean;
    error: boolean;
};

interface UseBlockEditorProps {
    collabProvider: HocuspocusProvider;
    userId: string;
    setIsAiLoading: (isAiLoading: boolean) => void;
    initialContent?: string;
    aiContent?: AiGenerationContent;
}

export const useBlockEditor = ({
    collabProvider,
    userId,
    initialContent,
    aiContent,
    setIsAiLoading,
}: UseBlockEditorProps): {
    editor: Editor | null;
    users: EditorUser[];
    collabState: WebSocketStatus;
} => {
    const [isSynced, setIsSynced] = useState(false);

    // State to ensure content generation is not triggered multiple times
    const fetchCount = useRef(0);
    // State for storing content generation responses
    const contentQueue = useRef<AiContentResponse[]>([]);
    // State for tracking currently rendered content
    const renderIndex = useRef(0);
    // State to store generated content buffer while streaming
    const contentBuffer = useRef("");

    const [collabState, setCollabState] = useState<WebSocketStatus>(WebSocketStatus.Connecting);

    const editor = useEditor(
        {
            autofocus: true,
            onCreate: () => {
                collabProvider?.on("synced", () => {
                    setIsSynced(true);
                });
            },
            // eslint-disable-next-line new-cap
            extensions: [
                // eslint-disable-next-line new-cap
                ...ExtensionKit({}),
                collabProvider &&
                    Collaboration.configure({
                        document: collabProvider.document,
                    }),
                collabProvider &&
                    CollaborationCursor.configure({
                        provider: collabProvider,
                        user: {
                            name: userId,
                            color: randomElement(userColors),
                        },
                    }),
            ],
            editorProps: {
                attributes: {
                    autocomplete: "off",
                    autocorrect: "off",
                    autocapitalize: "off",
                    class: "min-h-full",
                },
            },
        },
        [collabProvider],
    );
    const users = useMemo((): EditorUser[] => {
        if (!editor?.storage.collaborationCursor?.users) {
            return [];
        }

        return editor.storage.collaborationCursor?.users.map((user: EditorUser) => {
            const names = user.name?.split(" ");
            const firstName = names?.[0];
            const lastName = names?.[names.length - 1];
            const initials = `${firstName?.[0] || "?"}${lastName?.[0] || "?"}`;

            return { ...user, initials: initials.length ? initials : "?" };
        });
    }, [editor?.storage.collaborationCursor?.users]);

    useEffect(() => {
        collabProvider?.on("status", (event: { status: WebSocketStatus }) => {
            setCollabState(event.status);
        });
    }, [collabProvider]);

    useEffect(() => {
        if (isSynced) {
            if (!editor) {
                toast.error("An error occured in generating content. Please refresh the page.");
            }
            if (initialContent) {
                editor?.commands.setContent(initialContent);
            } else if (aiContent) {
                aiGenerateContent();
            }
        }
    }, [isSynced]); // eslint-disable-line react-hooks/exhaustive-deps

    const aiGenerateContent = async (): Promise<void> => {
        let interval: ReturnType<typeof setInterval>;

        const processContentSequentially = async (): Promise<void> => {
            if (aiContent && renderIndex.current >= aiContent.allTitles.length) {
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
                    editor && (await streamContent(currentContent.content, editor, contentBuffer));
                    contentQueue.current[renderIndex.current].isRendered = true;
                    renderIndex.current += 1; // Move to the next response
                }
            }

            // Schedule the next check. Adjust the delay as needed.
            interval = setTimeout(processContentSequentially, 1000);
        };

        if (aiContent && editor && fetchCount.current < 1 && editor.isEmpty) {
            fetchCount.current += 1;
            setIsAiLoading(true);
            aiContent.allTitles.forEach((title, index) => {
                generateContent(
                    aiContent.documentPrompt,
                    title,
                    aiContent.allTitles,
                    aiContent.contentSize,
                    aiContent.targetAudience,
                    aiContent.tone,
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
                            setIsAiLoading(false);
                            // Start the sequential processing with the first received response
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

    window.editor = editor;

    return { editor, users, collabState };
};
