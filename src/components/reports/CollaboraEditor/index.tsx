import React, { useRef, useState } from "react";

import { ChatSidebarCollabora } from "../Chat/ChatSidebarCollabora";

import { cn } from "@/lib/utils";
import { Chat, useChat } from "@/plugins/reports/hooks/use-chat";
import DataQuerySidebar from "@/components/reports/CollaboraEditor/DataQuerySidebar";
import DocQuerySidebar from "@/components/reports/CollaboraEditor/DocQuerySidebar";
import { useCollabora } from "@/plugins/reports/hooks/useCollabora";
// import { toast } from "sonner";
import { generateText } from "@/plugins/reports/utils/generateTextCollabora";

const CollaboraEditor = ({ fileId }: { fileId: string }): JSX.Element => {
    const collaboraRef = useRef<HTMLIFrameElement>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const chat: Chat = useChat({
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
    });

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
                        onClose={() => setShowSidebar(false)}
                        onQueryFormSubmit={handleQueryFormSubmit}
                    />
                ) : editor.zebraMode === "doc" ? (
                    <DocQuerySidebar onClose={() => setShowSidebar(false)} />
                ) : (
                    <DataQuerySidebar onClose={() => setShowSidebar(false)} />
                )}
            </div>
        </div>
    );
};

export default CollaboraEditor;
