import React, { memo } from "react";

import { cn } from "@/lib/utils";
export const Sidebar = memo(
    ({ isOpen, children, side }: { isOpen?: boolean; children?: React.ReactNode; side: "left" | "right" }) => {
        const windowClassName = cn(
            "absolute lg:relative top-0 bg-white lg:bg-white/30 lg:backdrop-blur-xl h-full z-[999] duration-300 transition-[width]",
            "dark:bg-black lg:dark:bg-black/30",
            side === "left" ? "left-0" : "right-0",
            !isOpen && (side === "left" ? "w-0 border-r-transparent" : "w-0 border-l-transparent"),
            isOpen &&
                (side === "left"
                    ? "w-80 border-r border-r-neutral-200 dark:border-r-neutral-800"
                    : "w-96 border-l border-l-neutral-200 dark:border-l-neutral-800"),
        );

        return (
            <div className={windowClassName}>
                <div className="w-full h-full overflow-hidden">
                    <div className={cn("w-full h-full overflow-auto", side === "left" ? "p-6" : "p-0")}>{children}</div>
                </div>
            </div>
        );
    },
);

Sidebar.displayName = "Sidepanel";
