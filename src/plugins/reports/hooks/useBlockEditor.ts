import { Editor, JSONContent, useEditor } from "@tiptap/react";
import { EditorState } from "prosemirror-state";

import { useSidebar } from "./useSidebar";
import type { SidebarState } from "./useSidebar";

import { initialContent } from "@/plugins/reports/initialContent";
import { ExtensionKit } from "@/plugins/reports/extensions/extension-kit";
import { Template } from "@/plugins/reports/types";

declare global {
    interface Window {
        editor: Editor | null;
    }
}

export const useBlockEditor = ({
    editorState,
    template,
}: {
    editorState?: JSONContent;
    template?: Template;
}): { editor: Editor | null; characterCount: any; leftSidebar: SidebarState } => {
    const leftSidebar = useSidebar();

    const editor = useEditor(
        {
            autofocus: true,
            onCreate: ({ editor }: { editor: Editor }) => {
                if (editor.isEmpty) {
                    editor.commands.setContent(
                        editorState ? editorState : template ? template.content : initialContent,
                    );
                    // The following code clears the history. Hopefully without side effects.
                    const newEditorState = EditorState.create({
                        doc: editor.state.doc,
                        plugins: editor.state.plugins,
                        schema: editor.state.schema,
                    });
                    editor.view.updateState(newEditorState);
                }
            },
            // eslint-disable-next-line new-cap
            extensions: [...ExtensionKit({})],
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

    const characterCount = editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
    };

    window.editor = editor;

    return { editor, characterCount, leftSidebar };
};
