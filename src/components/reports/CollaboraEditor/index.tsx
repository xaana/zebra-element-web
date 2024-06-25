import React, { useRef, useState } from "react";

import { ChatSidebarCollabora } from "../Chat/ChatSidebarCollabora";
import SuggestedPromptsCollabora from "../Chat/suggested-prompts-collabora";

import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/LoaderAlt";
import { Chat, useChat } from "@/plugins/reports/hooks/use-chat";
import DataQuerySidebar from "@/components/reports/CollaboraEditor/DataQuerySidebar";
import DocQuerySidebar from "@/components/reports/CollaboraEditor/DocQuerySidebar";
import { useCollabora } from "@/plugins/reports/hooks/useCollabora";
import { generateText } from "@/plugins/reports/utils/generateTextCollabora";
import { Message, Report } from "@/plugins/reports/types";

const CollaboraEditor = ({
    selectedReport,
    onCloseEditor,
    onDocumentLoadFailed,
}: {
    selectedReport: Report;
    onCloseEditor: () => void;
    onDocumentLoadFailed: () => void;
}): JSX.Element => {
    const editorRef = useRef<HTMLIFrameElement>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const handlePromptClick = useRef<undefined | ((prompt: string) => Promise<void>)>();
    const [isAiLoading, setIsAiLoading] = useState(false);

    const chatInitialMessage: Message = {
        id: "0",
        role: "system",
        content: `👋 Hi, I'm your AI writing partner. Select some text and then type below to have me change it.`,
        children: <SuggestedPromptsCollabora onPromptClick={handlePromptClick} />,
    };

    const chat: Chat = useChat({
        initialMessages: [chatInitialMessage],
        isOpen: showSidebar,
        open: () => setShowSidebar(true),
        close: () => setShowSidebar(false),
        toggle: () => setShowSidebar((prev) => !prev),
    });

    const editor = useCollabora({
        iframeRef: editorRef,
        selectedReport,
        chat,
        showSidebar,
        setShowSidebar,
        onCloseEditor,
        onDocumentLoadFailed,
        isAiLoading,
        setIsAiLoading,
    });

    handlePromptClick.current = async (prompt: string): Promise<void> => {
        const selectedText = await editor.fetchSelectedText();
        await generateText(prompt, selectedText, chat, editor);
    };

    const handleQueryFormSubmit = async (): Promise<void> => {
        if (chatInput.length === 0 || !chat) return;
        const inputText = chatInput;
        setChatInput("");
        const selectedText = await editor.fetchSelectedText();
        await generateText(inputText, selectedText, chat, editor);
    };

    return (
        <>
            {(isAiLoading || !editor.documentLoaded) && <Loader label="Zebra is loading..." />}
            <div className={cn("w-full h-full", editor.documentLoaded ? "flex" : "invisible")}>
                <div className="h-full flex-1">
                    <iframe
                        style={{ height: "100vh", width: "100%" }}
                        // className="flex-1"
                        ref={editorRef}
                        title="Collabora Online Viewer"
                        id="collabora-online-viewer"
                        name="collabora-online-viewer"
                        allow="clipboard-read *; clipboard-write *"
                        src={editor.startLoading ? editor.wopiUrl : ""}
                    />
                </div>
                <div
                    className={cn(
                        "h-full transition-[width] overflow-y-hidden border-l w-0 shrink-0 bg-card",
                        showSidebar ? "w-[350px] visible" : "w-0 invisible",
                    )}
                >
                    {editor.zebraMode === "chat" ? (
                        <ChatSidebarCollabora
                            chat={chat}
                            chatInput={chatInput}
                            setChatInput={setChatInput}
                            onClose={() => {
                                setShowSidebar(false);
                                chat.reset();
                            }}
                            onQueryFormSubmit={handleQueryFormSubmit}
                        />
                    ) : editor.zebraMode === "doc" ? (
                        <DocQuerySidebar
                            editor={editor}
                            onClose={() => {
                                setShowSidebar(false);
                                editor.setZebraMode("chat");
                            }}
                        />
                    ) : (
                        <DataQuerySidebar
                            editor={editor}
                            onClose={() => {
                                setShowSidebar(false);
                                editor.setZebraMode("chat");
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default CollaboraEditor;
