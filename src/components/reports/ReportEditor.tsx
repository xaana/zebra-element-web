import React, { useMemo } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";

import { useBlockEditor } from "@/plugins/reports/hooks/useBlockEditor";
import { Chat, useChat } from "@/plugins/reports/hooks/use-chat";
import { useAIState } from "@/plugins/reports/hooks/useAIState";
import { useSidebar } from "@/plugins/reports/hooks/useSidebar";
import { EditorHeader } from "@/components/reports/BlockEditor/EditorHeader";
import { BlockEditor } from "@/components/reports/BlockEditor";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import { AiGenerationContent, Report } from "@/plugins/reports/types";

interface ReportEditorProps {
    collabProvider: HocuspocusProvider;
    userId: string;
    onGoBack: () => void;
    onUpdateName: (name: string) => Promise<boolean>;
    selectedReport: Report;
    initialContent?: string;
    aiContent?: AiGenerationContent;
}
export const ReportEditor = ({
    collabProvider,
    userId,
    onGoBack,
    selectedReport,
    initialContent,
    aiContent,
    onUpdateName,
}: ReportEditorProps): JSX.Element => {
    const aiState = useAIState();

    const { editor, users, collabState } = useBlockEditor({
        collabProvider,
        userId,
        initialContent,
        aiContent,
        setIsAiLoading: aiState.setIsAiLoading,
    });

    const leftSidebar = useSidebar();
    const rightSidebar = useSidebar();

    const chat: Chat = useChat({
        isOpen: rightSidebar.isOpen,
        open: rightSidebar.open,
        close: rightSidebar.close,
        toggle: rightSidebar.toggle,
    });

    const providerValue = useMemo(() => {
        return {
            isAiLoading: aiState.isAiLoading,
            aiError: aiState.aiError,
            setIsAiLoading: aiState.setIsAiLoading,
            setAiError: aiState.setAiError,
            editor: editor,
            editorChat: chat,
            collabState: collabState,
            users: users,
        };
    }, [aiState, chat, editor, collabState, users]);

    return (
        <EditorContext.Provider value={providerValue}>
            {editor && (
                <>
                    <div className="w-full p-3 border-b bg-background">
                        <EditorHeader
                            isLeftSidebarOpen={leftSidebar.isOpen}
                            isRightSidebarOpen={rightSidebar.isOpen}
                            toggleLeftSidebar={leftSidebar.toggle}
                            toggleRightSidebar={rightSidebar.toggle}
                            editor={editor}
                            onGoBack={onGoBack}
                            selectedReport={selectedReport}
                            onUpdateName={onUpdateName}
                        />
                    </div>
                    <div style={{ height: "calc(100vh - 60px)" }} className="w-full">
                        <BlockEditor editor={editor} leftSidebar={leftSidebar} rightSidebar={rightSidebar} />
                    </div>
                </>
            )}
        </EditorContext.Provider>
    );
};
