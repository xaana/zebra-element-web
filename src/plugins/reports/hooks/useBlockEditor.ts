import { JSONContent, useEditor } from "@tiptap/react";
// import { EditorState } from "prosemirror-state";
import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useEffect, useMemo, useState } from "react";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import type { Doc as YDoc } from "yjs";
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
    ydoc,
    collabProvider,
    editorState,
}: {
    ydoc: YDoc | undefined;
    collabProvider?: HocuspocusProvider | null | undefined;
    editorState?: JSONContent;
}): {
    editor: Editor | null;
    collabState: WebSocketStatus;
    users: EditorUser[];
} => {
    const client = useMatrixClientContext();
    const [collabState, setCollabState] = useState<WebSocketStatus>(WebSocketStatus.Connecting);
    const editor = useEditor(
        {
            autofocus: true,
            // onCreate: ({ editor }: { editor: Editor }) => {
            //     if (editor.isEmpty) {
            //         editor.commands.setContent(editorState || template?.content || null);
            //         // The following code clears the history. Hopefully without side effects.
            //         const newEditorState = EditorState.create({
            //             doc: editor.state.doc,
            //             plugins: editor.state.plugins,
            //             schema: editor.state.schema,
            //         });
            //         editor.view.updateState(newEditorState);
            //     }
            // },
            // eslint-disable-next-line new-cap
            extensions: [
                // eslint-disable-next-line new-cap
                ...ExtensionKit({}),
                ...(ydoc
                    ? [
                          Collaboration.configure({
                              document: ydoc,
                          }),
                          CollaborationCursor.configure({
                              provider: collabProvider,
                              user: {
                                  name: client.getSafeUserId(),
                                  color: randomElement(userColors),
                              },
                          }),
                      ]
                    : []),
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
        [ydoc, collabProvider],
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
    window.editor = editor;

    return { editor, collabState, users };
};
