import React from "react";

import { cn } from "@/lib/utils";
import { useAtBottom } from "@/plugins/reports/hooks/use-at-bottom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

export function ButtonScrollToBottom({ className, ...props }: ButtonProps): JSX.Element {
    const isAtBottom = useAtBottom();

    return (
        <Button
            variant="outline"
            size="icon"
            className={cn(
                "p-1.5 h-auto w-auto z-[100] !rounded-full bg-white hover:bg-zinc-100 bg-opacity-95 !border-zinc-300 transition-opacity duration-200",
                isAtBottom ? "opacity-0" : "opacity-100",
                className,
            )}
            onClick={() =>
                document.getElementById("chat__container")?.scrollTo({
                    top: (document.getElementById("chat__container")?.scrollHeight || 0) + 500,
                    behavior: "smooth",
                })
            }
            {...props}
        >
            <Icon name="ArrowDown" className="fill-black opacity-100" />
            <span className="sr-only">Scroll to bottom</span>
        </Button>
    );
}
