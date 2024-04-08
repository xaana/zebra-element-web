import { EditorContent } from "@tiptap/react";
import React, { useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "../menus/ContentItemMenu";
import type { Editor } from "@tiptap/react";

import "@/plugins/reports/styles/editor.css";
import "@/plugins/reports/styles/index.css";

import { LinkMenu } from "@/components/reports/menus";
import { Sidebar } from "@/components/reports/Sidebar";
import { Loader } from "@/components/ui/LoaderAlt";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import ImageBlockMenu from "@/plugins/reports/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/plugins/reports/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/plugins/reports/extensions/Table/menus";
import { useAIState } from "@/plugins/reports/hooks/useAIState";
import { SidebarState } from "@/plugins/reports/hooks/useSidebar";

export interface BlockEditorProps {
    editor: Editor | null;
    characterCount: any;
    leftSidebar: SidebarState;
}

export const BlockEditor = ({ editor, characterCount, leftSidebar }: BlockEditorProps) => {
    const aiState = useAIState();
    const menuContainerRef = useRef(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const providerValue = useMemo(() => {
        return {
            isAiLoading: aiState.isAiLoading,
            aiError: aiState.aiError,
            setIsAiLoading: aiState.setIsAiLoading,
            setAiError: aiState.setAiError,
        };
    }, [aiState]);

    if (!editor) {
        return null;
    }

    const aiLoaderPortal = createPortal(<Loader label="Zebra is now doing its job." />, document.body);

    return (
        <EditorContext.Provider value={providerValue}>
            <div className="flex h-full" ref={menuContainerRef}>
                <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
                <div className="relative flex flex-col flex-1 h-full overflow-hidden">
                    <EditorHeader
                        characters={characterCount.characters()}
                        words={characterCount.words()}
                        isSidebarOpen={leftSidebar.isOpen}
                        toggleSidebar={leftSidebar.toggle}
                        editor={editor}
                    />
                    <EditorContent editor={editor} ref={editorRef} className="flex-1 overflow-y-auto" />
                    <ContentItemMenu editor={editor} />
                    <LinkMenu editor={editor} appendTo={menuContainerRef} />
                    <TextMenu editor={editor} />
                    <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                    <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                    <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                    <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
                </div>
            </div>
            {aiState.isAiLoading && aiLoaderPortal}
        </EditorContext.Provider>
    );
};