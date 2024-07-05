import React from "react";
import { formatDistanceToNow } from "date-fns";

import { DocumentThumbnail } from "./DocumentThumbnail";
import type { Report } from "@/plugins/reports/types";
import { ReportActions } from "./ReportActions";
import { SpreadsheetThumbnail } from "./SpreadsheetThumbnail";
import { IconDocumentExcel, IconDocumentWord } from "../../ui/icons";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const ReportCard = ({
    report,
    onSelectReport,
    onRename,
    onDuplicate,
    onDelete,
    userId,
    allUsers,
}: {
    report: Report;
    onSelectReport: (report: Report) => void;
    onRename: (reportId: string, newName: string) => Promise<boolean>;
    onDuplicate: (reportId: string) => Promise<void>;
    onDelete: (reportId: string) => Promise<void>;
    userId: string;
    allUsers: string[];
}): JSX.Element => {
    return (
        <div
            className={cn(
                "rounded-lg relative flex flex-col border bg-background text-left text-sm transition-all hover:bg-card overflow-hidden cursor-pointer outline-none",
            )}
            onClick={async () => await onSelectReport(report)}
        >
            <div className="w-full aspect-video relative shrink-0">
                <Badge
                    className={cn(
                        "absolute bottom-0 right-0 m-2 uppercase tracking-wide text-[10px] leading-none p-1",
                        // report.fileType === "docx" ? "bg-[#D7E9FF] text-[#2d74be]" : "bg-[#CFE3D7] text-[#3c9063]",
                        report.fileType === "docx" ? "bg-white text-[#2d74be]" : "bg-white text-[#3c9063]",
                    )}
                    variant="secondary"
                >
                    {report.fileType === "docx" ? (
                        <IconDocumentWord className="w-3 h-3 mr-1" />
                    ) : (
                        <IconDocumentExcel className="w-3 h-3 mr-1" />
                    )}
                    {report.fileType === "docx" ? "Document" : "Spreadsheet"}
                </Badge>
                {report.fileType === "docx" ? <DocumentThumbnail /> : <SpreadsheetThumbnail />}
            </div>
            <div className="p-3 flex-1 flex w-full flex-col justify-between gap-2 relative">
                <div className="font-semibold">{report.name}</div>
                <div className="text-[10px] text-muted-foreground">
                    {Number(report.id) < 0
                        ? "Preset report"
                        : "Edited " +
                          formatDistanceToNow(
                              new Date(report.timestamp.endsWith("Z") ? report.timestamp : report.timestamp + "Z"),
                              {
                                  addSuffix: true,
                              },
                          )}
                </div>
            </div>
            <div className="absolute bottom-0 right-0 p-1">
                <ReportActions
                    row={report}
                    onRename={onRename}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    allUsers={allUsers}
                />
            </div>
        </div>
    );
};
