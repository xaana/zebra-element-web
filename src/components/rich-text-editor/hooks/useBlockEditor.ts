import { useEditor } from "@tiptap/react";
import { useMemo } from "react";

import type { Editor } from "@tiptap/react";

import { ExtensionKit } from "@/components/rich-text-editor/extensions/extension-kit";
import { EditorUser } from "@/components/rich-text-editor/BlockEditor/types";

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

export const useBlockEditor = (): {
    editor: Editor | null;
    users: EditorUser[];
} => {
    const editor = useEditor(
        {
            autofocus: true,

            // eslint-disable-next-line new-cap
            extensions: [
                // eslint-disable-next-line new-cap
                ...ExtensionKit({}),
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
        [],
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

    window.editor = editor;

    return { editor, users };
};
