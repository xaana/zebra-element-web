import { Editor } from "@tiptap/react";
import { createContext } from "react";

import { Chat } from "@/plugins/reports/hooks/use-chat";

interface IEditorContext {
    editor: Editor | null;
    editorChat: Chat | null;
    isAiLoading: boolean;
    aiError?: string | null;
    setIsAiLoading: Function;
    setAiError: Function;
}

export const EditorContext = createContext<IEditorContext>({
    editor: null,
    editorChat: null,
    isAiLoading: false,
    aiError: null,
    setIsAiLoading: () => {},
    setAiError: () => {},
});
