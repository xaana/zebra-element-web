import React from "react";

import { ReportCard } from "./ReportCard";
import { ReportsGridPagination } from "./ReportsGridPagination";

import { Report } from "@/plugins/reports/types";

export const ReportsGrid = ({
    reports,
    onRename,
    onDuplicate,
    onDelete,
    userId,
    allUsers,
    setSelectedReport,
}: {
    reports: Report[];
    onRename: (reportId: string, newName: string) => Promise<boolean>;
    onDuplicate: (reportId: string) => Promise<void>;
    onDelete: (reportId: string) => Promise<void>;
    userId: string;
    allUsers: string[];
    setSelectedReport: React.Dispatch<React.SetStateAction<Report | null | undefined>>;
}): JSX.Element => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [reportsPerPage, setReportsPerPage] = React.useState(10);

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    const totalPages = Math.ceil(reports.length / reportsPerPage);
    return (
        <>
            {currentReports.length > 0 ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {currentReports.map((report) => (
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
            <ReportsGridPagination
                reportsPerPage={reportsPerPage}
                currentReports={currentReports}
                totalReports={reports.length}
                setReportsPerPage={setReportsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
            />
        </>
    );
};
