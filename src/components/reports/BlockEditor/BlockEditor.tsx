import { EditorContent } from "@tiptap/react";
import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { useAtomValue } from "jotai";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

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
import { generatedOutlineAtom } from "@/plugins/reports/stores/store";
import { streamContent, generateContent } from "@/plugins/reports/utils/generateEditorContent";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import { ChatSidebar } from "@/components/reports/Chat/ChatSidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ContentResponse = {
    content: string | null;
    isRendered: boolean;
    error: boolean;
};

export interface BlockEditorProps {
    editor: TiptapEditor | null;
    leftSidebar: SidebarState;
    rightSidebar: SidebarState;
}

export const BlockEditor = ({ editor, leftSidebar, rightSidebar }: BlockEditorProps): JSX.Element => {
    const menuContainerRef = useRef(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const { isAiLoading } = useContext(EditorContext);

    // State for content outline from store
    const generatedOutline = useAtomValue(generatedOutlineAtom);
    // State to ensure content generation is not triggered multiple times
    const fetchCount = useRef(0);
    // State for storing content generation responses
    const contentQueue = useRef<ContentResponse[]>([]);
    // State for tracking currently rendered content
    const renderIndex = useRef(0);
    // State to store generated content buffer while streaming
    const contentBuffer = useRef("");
    // State to track if content is currently being generated
    const [isLoadingContent, setIsLoadingContent] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        const processContentSequentially = async (): Promise<void> => {
            if (generatedOutline && renderIndex.current >= generatedOutline.allTitles.length) {
                clearTimeout(interval); // Clear when all content is processed
                setIsLoadingContent(false);
                return;
            }

            const currentContent = contentQueue.current[renderIndex.current];

            if (currentContent && !currentContent.isRendered) {
                if (currentContent.error) {
                    console.error(`Skipping index ${renderIndex.current} due to fetch error.`);
                    renderIndex.current += 1; // Optionally, you could retry instead of skipping
                } else if (currentContent.content) {
                    // Await here ensures we don't move to the next content until this one is fully processed
                    editor && (await streamContent(currentContent.content, editor, contentBuffer));
                    contentQueue.current[renderIndex.current].isRendered = true;
                    renderIndex.current += 1; // Move to the next response
                }
            }

            // Schedule the next check. Adjust the delay as needed.
            interval = setTimeout(processContentSequentially, 1000);
        };

        if (generatedOutline && editor && fetchCount.current < 1 && editor.isEmpty) {
            fetchCount.current += 1;
            setIsLoadingContent(true);
            generatedOutline.allTitles.forEach((title, index) => {
                generateContent(
                    SettingsStore.getValue("reportsApiUrl"),
                    generatedOutline.documentPrompt,
                    title,
                    generatedOutline.allTitles,
                    generatedOutline.contentSize,
                    generatedOutline.targetAudience,
                    generatedOutline.tone,
                )
                    .then(async (data) => {
                        if (!data) {
                            console.error("No data received");
                            setIsLoadingContent(false);
                            return;
                        }
                        contentQueue.current[index] = {
                            content: data,
                            isRendered: false,
                            error: false,
                        };
                        if (index === 0) {
                            setIsLoadingContent(false);
                            // Start the sequential processing with the first received response
                            processContentSequentially();
                        }
                    })
                    .catch((err) => {
                        contentQueue.current[index] = {
                            content: null,
                            isRendered: false,
                            error: true,
                        };
                        console.error(err);
                        setIsLoadingContent(false);
                    });
            });
        }
    }, [generatedOutline, editor]);

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
        <div className="w-full h-full overflow-y-auto relative flex">
            <Sidebar side="left" isOpen={leftSidebar.isOpen}>
                <TableOfContents onItemClick={handlePotentialCloseLeft} editor={editor} />
            </Sidebar>
            <div className="flex-1 flex h-max relative justify-center overflow-y-auto" ref={menuContainerRef}>
                <div className="editor__container relative flex flex-col h-full shrink basis-[55em]">
                    <Separator className="h-6 invisible" />
                    <EditorContent
                        editor={editor}
                        ref={editorRef}
                        className={cn(
                            "flex-1 w-full h-full border-2 rounded-2xl transition-all outline-none",
                            editor.isFocused &&
                                "outline outline-[2.5px] -outline-offset-[3.5px] outline-primary/40  dark:outline-primary-500",
                        )}
                        style={{ minHeight: "calc(100vh - 108px)" }}
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
            {(isAiLoading || isLoadingContent) && aiLoaderPortal}
        </div>
    );
};
