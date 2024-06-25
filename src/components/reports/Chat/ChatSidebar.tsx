import React, { useContext, useState, useEffect } from "react";

import { Icon } from "@/components/ui/Icon";
import { ChatContent } from "@/components/reports/Chat/chat-content";
import { Button } from "@/components/ui/button";
import { ChatQueryForm } from "@/components/reports/Chat/chat-query-form";
import { Sidebar } from "@/components/reports/Sidebar";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import { SidebarState } from "@/plugins/reports/hooks/useSidebar";
import { generateText } from "@/plugins/reports/utils/generateText";
import { Chat } from "@/plugins/reports/hooks/use-chat";

export const ChatSidebar = ({ sidebar, chat: editorChat }: { sidebar: SidebarState; chat: Chat }): JSX.Element => {
    const { editor } = useContext(EditorContext);
    const [chatInput, setChatInput] = useState("");

    useEffect(() => {
        editorChat.setMessages((prev) =>
            prev.map((message, index) => ({
                ...message,
                children: index !== 0 ? null : message.children,
            })),
        );
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChatStop = (): void => {
        console.log("Stop");
    };

    const handleQueryFormSubmit = async (): Promise<void> => {
        if (chatInput.length === 0 || !editorChat || !editor) return;
        setChatInput("");
        await generateText(chatInput, editor, editorChat);
    };
    return (
        <Sidebar side="right" isOpen={sidebar.isOpen}>
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
                        onClick={() => editorChat?.reset()}
                        disabled={editorChat?.messages.length < 2}
                        className="py-1 px-2 w-auto h-auto rounded-full text-[10px]"
                    >
                        <Icon name="Trash2" strokeWidth={1.75} className="w-3.5 h-3.5 mr-1" />
                        Clear Chat
                    </Button>
                    <Button size="sm" variant="outline" onClick={sidebar.close} className="p-1 h-auto rounded-full">
                        <Icon name="X" className="w-3.5 h-3.5" />
                    </Button>
                </div>
                <ChatContent chat={editorChat} isLoading={editorChat?.isLoading ?? false} />
                <ChatQueryForm
                    input={chatInput}
                    isLoading={editorChat?.isLoading ?? false}
                    setInput={setChatInput}
                    onQueryFormSubmit={handleQueryFormSubmit}
                    onStop={handleChatStop}
                />
            </div>
        </Sidebar>
    );
};
