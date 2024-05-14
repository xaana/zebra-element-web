import { EditorContent } from "@tiptap/react";
import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { useAtomValue } from "jotai";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { TextMenu } from "../menus/TextMenu";
import type { Editor as TiptapEditor } from "@tiptap/react";

import { ContentItemMenu } from "@/components/reports/menus/ContentItemMenu";
import { TableOfContents } from "@/components/reports/TableOfContents";
import { ChatContent } from "@/components/reports/Chat/chat-content";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import "@/plugins/reports/styles/editor.css";
import "@/plugins/reports/styles/index.css";
import { LinkMenu } from "@/components/reports/menus";
import { Sidebar } from "@/components/reports/Sidebar";
import { Loader } from "@/components/ui/LoaderAlt";
import ImageBlockMenu from "@/plugins/reports/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/plugins/reports/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "@/plugins/reports/extensions/Table/menus";
import { SidebarState } from "@/plugins/reports/hooks/useSidebar";
import { ChatQueryForm } from "@/components/reports/Chat/chat-query-form";
import { generatedOutlineAtom } from "@/plugins/reports/stores/store";
import { streamContent, generateContent } from "@/plugins/reports/utils/generateEditorContent";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import { generateText } from "@/plugins/reports/utils/generateText";
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

    const { editorChat, isAiLoading } = useContext(EditorContext);

    const [chatInput, setChatInput] = useState("");
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

    const handleChatStop = (): void => {
        console.log("Stop");
    };

    const handleQueryFormSubmit = async (): Promise<void> => {
        if (chatInput.length === 0 || !editorChat || !editor) return;
        await generateText(chatInput, editor, editorChat);
    };

    return (
        <>
            <div className="flex h-full relative" ref={menuContainerRef}>
                <Sidebar side="left" isOpen={leftSidebar.isOpen}>
                    <TableOfContents onItemClick={handlePotentialCloseLeft} editor={editor} />
                </Sidebar>
                <div className="relative flex flex-col flex-1 h-full overflow-visible">
                    <EditorContent editor={editor} ref={editorRef} className="flex-1 overflow-y-auto" />
                    <ContentItemMenu editor={editor} />
                    <LinkMenu editor={editor} appendTo={menuContainerRef} />
                    <TextMenu editor={editor} />
                    <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                    <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                    <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                    <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
                </div>
                <Sidebar side="right" isOpen={rightSidebar.isOpen}>
                    <div className="w-full h-full relative bg-card">
                        <div className="absolute top-1.5 right-2 w-full flex justify-end gap-1.5 items-center z-10">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editorChat?.reset()}
                                className="p-1 h-auto rounded-full"
                            >
                                <Icon name="Trash2" strokeWidth={1.75} className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={rightSidebar.close}
                                className="p-1 h-auto rounded-full"
                            >
                                <Icon name="X" className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <ChatContent isLoading={editorChat?.isLoading ?? false} />
                        <ChatQueryForm
                            input={chatInput}
                            isLoading={editorChat?.isLoading ?? false}
                            setInput={setChatInput}
                            onQueryFormSubmit={handleQueryFormSubmit}
                            onStop={handleChatStop}
                        />
                    </div>
                </Sidebar>
            </div>
            {(isAiLoading || isLoadingContent) && aiLoaderPortal}
        </>
    );
};
