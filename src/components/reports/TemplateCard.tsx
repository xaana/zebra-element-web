import React from "react";
import { formatDistanceToNow } from "date-fns";

import type { Template } from "@/plugins/reports/types";

import { cn } from "@/lib/utils";
export const TemplateCard = ({
    template,
    selected,
    setSelectedTemplate,
}: {
    template: Template;
    selected: boolean | undefined;
    setSelectedTemplate: React.Dispatch<React.SetStateAction<Template | undefined>>;
}) => {
    return (
        <button
            className={cn(
                "rounded-lg border bg-background pb-3 text-left text-sm transition-all hover:bg-primary/10 overflow-hidden",
                selected && "outline outline-4 outline-primary bg-primary/10",
            )}
            onClick={() => setSelectedTemplate(template)}
        >
            <img
                src="https://designshack.net/wp-content/uploads/Modern-Minimal-Annual-Report-Template.jpg"
                alt="Template Preview"
                className="aspect-video object-cover"
            />
            <div className="p-3">
                <div className="flex w-full flex-col gap-2">
                    <div className={cn("font-semibold", selected && "text-primary")}>{template.name}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">{template.description}</div>
                    <div className="text-[10px] mt-2 text-muted-foreground">
                        Created{" "}
                        {formatDistanceToNow(new Date(template.createdAt), {
                            addSuffix: true,
                        })}
                    </div>
                </div>
            </div>
        </button>
    );
};
