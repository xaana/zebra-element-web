import React from "react";

import { Icon } from "@/components/ui/Icon";
import { ChatContent } from "@/components/reports/Chat/chat-content";
import { Button } from "@/components/ui/button";
import { ChatQueryForm } from "@/components/reports/Chat/chat-query-form";
import { Chat } from "@/plugins/reports/hooks/use-chat";

export const ChatSidebarCollabora = ({
    chat,
    chatInput,
    setChatInput,
    onClose,
    onQueryFormSubmit,
}: {
    chat: Chat;
    chatInput: string;
    setChatInput: React.Dispatch<React.SetStateAction<string>>;
    onClose: () => void;
    onQueryFormSubmit: () => void;
}): JSX.Element => {
    const handleChatStop = (): void => {
        console.log("Stop");
    };
    return (
        <div className="w-full h-full relative bg-card">
            <div className="absolute top-1.5 right-2 w-full flex justify-end gap-1.5 items-center z-10">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => chat?.reset()}
                    disabled={chat.messages.length < 2}
                    className="py-1 px-2 w-auto h-auto rounded-full text-[10px]"
                >
                    <Icon name="Trash2" strokeWidth={1.75} className="w-3.5 h-3.5 mr-1" />
                    Clear Chat
                </Button>
                <Button size="sm" variant="outline" onClick={onClose} className="p-1 h-auto rounded-full">
                    <Icon name="X" className="w-3.5 h-3.5" />
                </Button>
            </div>
            <ChatContent chat={chat} isLoading={chat?.isLoading ?? false} />
            <ChatQueryForm
                input={chatInput}
                isLoading={chat?.isLoading ?? false}
                setInput={setChatInput}
                onQueryFormSubmit={onQueryFormSubmit}
                onStop={handleChatStop}
            />
        </div>
    );
};
