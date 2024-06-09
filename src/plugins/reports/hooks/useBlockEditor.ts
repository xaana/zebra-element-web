import { useEditor } from "@tiptap/react";
import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useEffect, useMemo, useState } from "react";

import type { Editor } from "@tiptap/react";

import { ExtensionKit } from "@/plugins/reports/extensions/extension-kit";
import { EditorUser } from "@/components/reports/BlockEditor/types";
import { randomElement } from "@/lib/utils";
import { userColors } from "@/lib/constants";

declare global {
    interface Window {
        editor: Editor | null;
    }
}

export const useBlockEditor = ({
    collabProvider,
    userId,
    initialContent,
}: {
    collabProvider: HocuspocusProvider;
    userId: string;
    initialContent?: string;
}): {
    editor: Editor | null;
    users: EditorUser[];
    collabState: WebSocketStatus;
} => {
    const [collabState, setCollabState] = useState<WebSocketStatus>(WebSocketStatus.Connecting);

    const editor = useEditor(
        {
            autofocus: true,
            onCreate: () => {
                collabProvider?.on("synced", () => {
                    if (editor?.isEmpty && initialContent) {
                        editor.commands.setContent(initialContent);
                    }
                });
            },
            // eslint-disable-next-line new-cap
            extensions: [
                // eslint-disable-next-line new-cap
                ...ExtensionKit({}),
                Collaboration.configure({
                    document: collabProvider.document,
                }),
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
        collabProvider.on("status", (event: { status: WebSocketStatus }) => {
            setCollabState(event.status);
        });
    }, [collabProvider]);

    window.editor = editor;

    return { editor, users, collabState };
};
