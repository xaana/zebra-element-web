import React from "react";

import { Icon } from "@/components/ui/Icon";
import { IconZebra } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const HeaderText = ({ showOutline }: { showOutline: boolean }): JSX.Element => {
    return (
        <div className={cn("flex justify-center", showOutline ? "gap-2" : "gap-4")}>
            <div className="relative">
                <IconZebra className={cn("text-primary-default", showOutline ? "w-6 h-6" : "w-16 h-16")} />
                <Icon
                    name="Sparkles"
                    className={cn(
                        "absolute -top-1 -right-1 text-primary-default",
                        showOutline ? "w-2.5 h-2.w-2.5" : "h-5 w-5",
                    )}
                />
            </div>
            <div>
                <div className={cn("font-semibold", showOutline ? "text-lg" : "text-3xl")}>Generate Report</div>
                {!showOutline && <div className="text-muted-foreground">Craft a report using Zebra AI</div>}
            </div>
        </div>
    );
};

export default HeaderText;
