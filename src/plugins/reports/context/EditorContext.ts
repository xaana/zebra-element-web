import { Editor } from "@tiptap/react";
import { createContext } from "react";
import { WebSocketStatus } from "@hocuspocus/provider";

import { EditorUser } from "@/components/reports/BlockEditor/types";
import { Chat } from "@/plugins/reports/hooks/use-chat";

interface IEditorContext {
    editor: Editor | null;
    editorChat: Chat | null;
    isAiLoading: boolean;
    aiError?: string | null;
    setIsAiLoading: Function;
    setAiError: Function;
    collabState: WebSocketStatus;
    users: EditorUser[];
}

export const EditorContext = createContext<IEditorContext>({
    editor: null,
    editorChat: null,
    isAiLoading: false,
    aiError: null,
    setIsAiLoading: () => {},
    setAiError: () => {},
    collabState: WebSocketStatus.Connecting,
    users: [],
});
