import React from "react";

import { type Message } from "@/plugins/reports/types";
import { Separator } from "@/components/ui/separator";
import { ChatMessage } from "@/components/reports/Chat/chat-message";

export interface ChatListTypes {
    messages: Message[];
}

export function ChatList({ messages }: ChatListTypes): JSX.Element | null {
    if (!messages.length) {
        return null;
    }

    return (
        <div className="chat__list relative mx-auto max-w-2xl overflow-visible px-4">
            {messages.map((message, index) => (
                <div id={`message-${message.id}`} className="chat__message" key={index}>
                    <ChatMessage message={message} showRegenerate={index === messages.length - 1} />
                    {index < messages.length - 1 && <Separator className="my-4 group-[.maximised]/main:md:my-8" />}
                </div>
            ))}
        </div>
    );
}
