import React from "react";
import { formatDistanceToNow } from "date-fns";

// import { TemplateActions } from "./TemplateActions";

import { ReportThumbnail } from "./ReportThumbnail";
import type { Report } from "@/plugins/reports/types";

import { Badge } from "@/components/ui/badge";

export const ReportCard = ({
    report,
    onSelectReport,
}: {
    report: Report;
    onSelectReport: (report: Report) => void;
}): JSX.Element => {
    return (
        <div
            className="rounded-lg border bg-background text-left text-sm transition-all hover:bg-card overflow-hidden cursor-pointer outline-none"
            onClick={async () => await onSelectReport(report)}
        >
            <div className="w-full aspect-video relative">
                <ReportThumbnail />
            </div>
            <div className="p-3">
                <div className="flex w-full flex-col gap-2 relative">
                    <div className="font-semibold">{report.name}</div>
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
