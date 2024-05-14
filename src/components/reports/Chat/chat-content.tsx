import React from "react";
import { useContext } from "react";

import { ChatList } from "@/components/reports/Chat/chat-list";
import { ChatScrollAnchor } from "@/components/reports/Chat/chat-scroll-anchor";
import { cn } from "@/lib/utils";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
export const ChatContent = ({ isLoading }: { isLoading: boolean }): JSX.Element => {
    const { editorChat } = useContext(EditorContext);
    return (
        <>
            <div
                id="chat__container"
                className="w-full mx-auto h-full overflow-x-hidden overflow-y-auto scrollbar--custom"
            >
                <div className="w-full pt-8">
                    {editorChat && editorChat.messages.length > 0 && <ChatList messages={editorChat.messages} />}
                </div>
                <div className={cn("transition-all mt-[190px]")}>
                    <ChatScrollAnchor trackVisibility={isLoading} />
                </div>
            </div>
        </>
    );
};
