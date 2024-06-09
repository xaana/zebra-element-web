import { EditorContent } from "@tiptap/react";
import React, { useRef, useCallback, useContext } from "react";
import { createPortal } from "react-dom";

import type { Editor as TiptapEditor } from "@tiptap/react";

import { TextMenu } from "@/components/reports/menus/TextMenu";
import { ContentItemMenu } from "@/components/reports/menus/ContentItemMenu";
import { TableOfContents } from "@/components/reports/TableOfContents";
import "@/plugins/reports/styles/editor.css";
import "@/plugins/reports/styles/index.css";
import { LinkMenu } from "@/components/reports/menus";
import { Sidebar } from "@/components/reports/Sidebar";
import { Loader } from "@/components/ui/LoaderAlt";
import ImageBlockMenu from "@/plugins/reports/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/plugins/reports/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/plugins/reports/extensions/Table/menus";
import { SidebarState } from "@/plugins/reports/hooks/useSidebar";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import { ChatSidebar } from "@/components/reports/Chat/ChatSidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface BlockEditorProps {
    editor: TiptapEditor | null;
    leftSidebar: SidebarState;
    rightSidebar: SidebarState;
}

export const BlockEditor = ({ editor, leftSidebar, rightSidebar }: BlockEditorProps): JSX.Element => {
    const menuContainerRef = useRef(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const { isAiLoading } = useContext(EditorContext);

    const handlePotentialCloseLeft = useCallback(() => {
        if (window.innerWidth < 1024) {
            leftSidebar.close();
        }
    }, [leftSidebar]);

    if (!editor) {
        return <></>;
    }

    const aiLoaderPortal = createPortal(<Loader label="Zebra is generating content..." />, document.body);

    return (
        <div className="w-full h-full relative flex justify-between">
            <Sidebar side="left" isOpen={leftSidebar.isOpen}>
                <TableOfContents onItemClick={handlePotentialCloseLeft} editor={editor} />
            </Sidebar>
            <div className="h-full flex-1 flex relative justify-center" ref={menuContainerRef}>
                <div className="editor__container h-full overflow-y-auto relative flex flex-col shrink basis-[55em]">
                    <Separator className="h-6 invisible" />
                    <EditorContent
                        editor={editor}
                        ref={editorRef}
                        className={cn(
                            "flex-1 w-full h-auto border-2 rounded-2xl transition-all outline-none",
                            editor.isFocused &&
                                "outline outline-[2.5px] -outline-offset-[3.5px] outline-primary/40  dark:outline-primary-500",
                        )}
                        // style={{ minHeight: "calc(100vh - 108px)" }}
                    />
                    <ContentItemMenu editor={editor} />
                    <LinkMenu editor={editor} appendTo={menuContainerRef} />
                    <TextMenu editor={editor} />
                    <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                    <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                    <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                    <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
                    <Separator className="h-6 invisible" />
                </div>
            </div>
            <ChatSidebar sidebar={rightSidebar} />
            {isAiLoading && aiLoaderPortal}
        </div>
    );
};
