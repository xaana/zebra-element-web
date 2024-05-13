import React from "react";

import { Message } from "@/plugins/reports/types";
import { cn } from "@/lib/utils";
import { IconZebra } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";

export interface ChatMessageProps {
    message: Message;
    showRegenerate: boolean;
}

export function ChatMessage({ message, showRegenerate, ...props }: ChatMessageProps): JSX.Element {
    return (
        <div className="group relative mb-4 flex items-start" {...props}>
            <div
                className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
                    message.role === "user" ? "bg-background" : "bg-primary-700 text-primary-foreground",
                )}
            >
                {message.role === "user" ? (
                    <Icon name="UserRound" strokeWidth={1.5} className="h-4 w-4" />
                ) : (
                    <IconZebra className="h-5 w-5" />
                )}
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1 mt-[1px] leading-7">
                {message.content}
                {message.children && <div className="my-4">{message.children}</div>}
            </div>
        </div>
    );
}
