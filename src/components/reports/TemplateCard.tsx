import React from "react";
import { formatDistanceToNow } from "date-fns";

import type { Template } from "@/plugins/reports/types";
import { TemplateActions } from "./TemplateActions";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const TemplateCard = ({
    template,
    selected,
    onSelectTemplate,
}: {
    template: Template;
    selected: boolean | undefined;
    onSelectTemplate: (template: Template) => Promise<void>;
}): JSX.Element => {
    return (
        <div
            className={cn(
                "rounded-lg border bg-background text-left text-sm transition-all hover:bg-card overflow-hidden cursor-pointer outline-none",
                selected && "outline outline-4 outline-primary bg-primary/10",
            )}
            onClick={async () => await onSelectTemplate(template)}
        >
            <div className="w-full aspect-video relative">
                <img
                    src="https://designshack.net/wp-content/uploads/Modern-Minimal-Annual-Report-Template.jpg"
                    alt="Template Preview"
                    className="aspect-video object-cover"
                />
            </div>
            <div className="p-3">
                <div className="flex w-full flex-col gap-2">
                    <div className={cn("font-semibold", selected && "text-primary-default")}>{template.name}</div>
                    {/* <div className="line-clamp-2 text-xs text-muted-foreground">{template.description}</div> */}
                    <div>
                        <Badge
                            className="uppercase tracking-wide text-[10px] leading-none p-1 text-muted-foreground"
                            variant="secondary"
                        >
                            {template.type === "document" ? "Document" : "Template"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-start">
                        <div className="text-[10px] mt-2 text-muted-foreground">
                            Edited{" "}
                            {formatDistanceToNow(new Date(template.timestamp), {
                                addSuffix: true,
                            })}
                        </div>
                        <TemplateActions row={template} />
                    </div>
                </div>
            </div>
        </div>
    );
};
