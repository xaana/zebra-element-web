import React, { useRef, useState } from "react";

import { ChatSidebarCollabora } from "../Chat/ChatSidebarCollabora";
import SuggestedPromptsCollabora from "../Chat/suggested-prompts-collabora";

import { cn } from "@/lib/utils";
import { Chat, useChat } from "@/plugins/reports/hooks/use-chat";
import DataQuerySidebar from "@/components/reports/CollaboraEditor/DataQuerySidebar";
import DocQuerySidebar from "@/components/reports/CollaboraEditor/DocQuerySidebar";
import { useCollabora } from "@/plugins/reports/hooks/useCollabora";
// import { toast } from "sonner";
import { generateText } from "@/plugins/reports/utils/generateTextCollabora";
import { Message } from "@/plugins/reports/types";

const CollaboraEditor = ({ fileId, onCloseEditor }: { fileId: string; onCloseEditor: () => void }): JSX.Element => {
    const collaboraRef = useRef<HTMLIFrameElement>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const handlePromptClick = useRef<undefined | ((prompt: string) => Promise<void>)>();

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
        iframeRef: collaboraRef,
        fileId,
        chat,
        showSidebar,
        setShowSidebar,
        onCloseEditor,
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
        <div className={cn("w-full h-full", editor.documentLoaded ? "flex" : "invisible")}>
            <div className="h-full flex-1">
                <iframe
                    style={{ height: "100vh", width: "100%" }}
                    // className="flex-1"
                    ref={collaboraRef}
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
    );
};

export default CollaboraEditor;
