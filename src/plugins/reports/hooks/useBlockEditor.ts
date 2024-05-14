import { JSONContent, useEditor } from "@tiptap/react";
import { EditorState } from "prosemirror-state";

import type { Editor } from "@tiptap/react";

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
}): {
    editor: Editor | null;
} => {
    const editor = useEditor(
        {
            autofocus: true,
            // @ts-expect-error @tiptap/react Editor
            onCreate: ({ editor }: { editor: Editor }) => {
                if (editor.isEmpty) {
                    editor.commands.setContent(editorState || template?.content || null);
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

    window.editor = editor;

    return { editor };
};
