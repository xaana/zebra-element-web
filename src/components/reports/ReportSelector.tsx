import React, { useEffect, useState } from "react";

import type { AiGenerationContent, Report } from "@/plugins/reports/types";

import { ReportFileImport } from "@/components/reports/ReportFileImport";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportCard } from "@/components/reports/ReportCard";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ReportSelectorProps {
    reports: Report[];
    userId: string;
    setSelectedReport: React.Dispatch<React.SetStateAction<Report | null | undefined>>;
    onCreateNewFromBlank: () => void;
    onFileUpload: (file: File) => Promise<void>;
    onRename: (reportId: string, newName: string) => Promise<boolean>;
    onDuplicate: (reportId: string) => Promise<void>;
    onDelete: (reportId: string) => Promise<void>;
    onAiGenerate: (aiGenerate: AiGenerationContent) => Promise<void>;
    allUsers: string[];
}

export const ReportSelector = ({
    reports,
    setSelectedReport,
    userId,
    onFileUpload,
    onCreateNewFromBlank,
    onRename,
    onDuplicate,
    onDelete,
    onAiGenerate,
    allUsers,
}: ReportSelectorProps): JSX.Element => {
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [filterValue, setFilterValue] = useState("all");
    const [displayType, setDisplayType] = useState("grid");

    useEffect(() => {
        if (filterValue === "owned") {
            setFilteredReports(reports.filter((report) => report.owner === userId));
        } else if (filterValue === "shared") {
            setFilteredReports(reports.filter((report) => report.owner !== userId));
        } else {
            setFilteredReports(reports);
        }
    }, [filterValue, reports, userId]);

    const handleSelectReport = async (report: Report | null | undefined): Promise<void> => {
        setSelectedReport(report);
    };

    const handleAiGenerate = async (
        documentPrompt: string,
        allTitles: string[],
        contentSize: string,
        tone: string,
        targetAudience: string,
        contentMediaIds?: string[],
        selectedTemplateId?: string,
    ): Promise<void> => {
        onAiGenerate({
            documentPrompt,
            allTitles,
            contentSize,
            tone,
            targetAudience,
            contentMediaIds,
            templateId: selectedTemplateId,
        } as AiGenerationContent);
    };

    return (
        <>
            <div className="w-full text-2xl font-semibold mb-2 flex items-center gap-2">
                <Icon name="GalleryVerticalEnd" className="h-5 w-5" />
                All Reports
            </div>
            <div className="flex items-center gap-2 mb-6">
                <ReportGenerator onReportGenerate={handleAiGenerate} allReports={reports} userId={userId} />
                <ReportFileImport onFileUpload={onFileUpload} />
                <Button
                    className="font-semibold text-sm"
                    onClick={() => onCreateNewFromBlank()} // open blank editor
                    size="sm"
                    variant="outline"
                >
                    <Icon name="Plus" className="mr-2" />
                    New From Blank
                </Button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <ToggleGroup
                    type="single"
                    value={filterValue}
                    onValueChange={(value) => {
                        if (value) setFilterValue(value);
                    }}
                    className="justify-start gap-2"
                    size="sm"
                >
                    <ToggleGroupItem value="all" aria-label="Toggle all">
                        <Icon name="AlignJustify" className="mr-2" />
                        All
                    </ToggleGroupItem>
                    <ToggleGroupItem value="owned" aria-label="Toggle templates">
                        <Icon name="FileCheck2" className="mr-2" />
                        My Reports
                    </ToggleGroupItem>
                    <ToggleGroupItem value="shared" aria-label="Toggle reports">
                        <Icon name="Users" className="mr-2" />
                        Shared with me
                    </ToggleGroupItem>
                </ToggleGroup>

                <Tabs value={displayType} onValueChange={(value) => setDisplayType(value)} className="">
                    <TabsList>
                        <TabsTrigger value="grid">
                            <Icon className="mr-2" name="LayoutGrid" />
                            Grid
                        </TabsTrigger>
                        <TabsTrigger value="list">
                            <Icon className="mr-2" name="List" />
                            List
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {displayType === "grid" ? (
                <>
                    {filteredReports.length > 0 ? (
                        <div className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredReports.map((report) => (
                                <ReportCard
                                    key={report.id}
                                    report={report}
                                    onSelectReport={(report) => setSelectedReport(report)}
                                    onRename={onRename}
                                    onDuplicate={onDuplicate}
                                    userId={userId}
                                    onDelete={onDelete}
                                    allUsers={allUsers}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="w-full flex justify-center items-center p-10 text-muted-foreground text-sm">
                            No documents to show.
                        </div>
                    )}
                </>
            ) : (
                <ReportsList
                    reports={filteredReports}
                    onSelectReport={handleSelectReport}
                    onRename={onRename}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    allUsers={allUsers}
                />
            )}
        </>
    );
};
