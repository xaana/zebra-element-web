import React from "react";

import { ChatList } from "@/components/reports/Chat/chat-list";
import { ChatScrollAnchor } from "@/components/reports/Chat/chat-scroll-anchor";
import { cn } from "@/lib/utils";
import { Chat } from "@/plugins/reports/hooks/use-chat";
export const ChatContent = ({ chat, isLoading }: { chat: Chat; isLoading: boolean }): JSX.Element => {
    return (
        <>
            <div id="chat__container" className="w-full mx-auto h-full overflow-y-auto scrollbar--custom">
                <div className="w-full pt-8">
                    {chat && chat.messages.length > 0 && <ChatList messages={chat.messages} />}
                </div>
                <div className={cn("transition-all mt-[80px]")}>
                    <ChatScrollAnchor trackVisibility={isLoading} />
                </div>
            </div>
        </>
    );
};
