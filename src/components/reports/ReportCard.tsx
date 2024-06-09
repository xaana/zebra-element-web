import React from "react";
import { formatDistanceToNow } from "date-fns";

import type { Report } from "@/plugins/reports/types";
// import { TemplateActions } from "./TemplateActions";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const ReportCard = ({
    report,
    selected,
    onSelectReport,
}: {
    report: Report;
    selected: boolean | undefined;
    onSelectReport: (report: Report) => Promise<void>;
}): JSX.Element => {
    return (
        <div
            className={cn(
                "rounded-lg border bg-background text-left text-sm transition-all hover:bg-card overflow-hidden cursor-pointer outline-none",
                selected && "outline outline-4 outline-primary bg-primary/10",
            )}
            onClick={async () => await onSelectReport(report)}
        >
            <div className="w-full aspect-video relative">
                <img
                    src="https://designshack.net/wp-content/uploads/Modern-Minimal-Annual-Report-Report.jpg"
                    alt="Report Preview"
                    className="aspect-video object-cover"
                />
            </div>
            <div className="p-3">
                <div className="flex w-full flex-col gap-2 relative">
                    <div className={cn("font-semibold", selected && "text-primary-default")}>{report.name}</div>
                    {/* <div className="line-clamp-2 text-xs text-muted-foreground">{report.description}</div> */}
                    <div>
                        <Badge
                            className="uppercase tracking-wide text-[10px] leading-none p-1 text-muted-foreground"
                            variant="secondary"
                        >
                            {report.type === "report" ? "Report" : "Report"}
                        </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                        {Number(report.id) < 0
                            ? "Preset report"
                            : "Edited " +
                              formatDistanceToNow(new Date(report.timestamp), {
                                  addSuffix: true,
                              })}
                    </div>
                    {/* <div className="absolute bottom-0.5 right-0.5">
                        <TemplateActions row={report} />
                    </div> */}
                </div>
            </div>
        </div>
    );
};
