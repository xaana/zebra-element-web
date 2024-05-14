import React, { useEffect, useState } from "react";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { getVectorConfig } from "../../vector/getconfig";
import ReportsTable from "./ReportsTable";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

export type Report = {
    id: string;
    title: string;
    timestamp: string;
    status: string;
};

export const ReportsManager = ({
    onNewReport,
    onEditReport,
}: {
    onNewReport: () => void;
    onEditReport: (report: Report) => void;
}): JSX.Element => {
    const client = useMatrixClientContext();
    const userId: string = client.getSafeUserId();
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        const fetchReportsData = async (): Promise<void> => {
            let apiUrl;
            const configData = await getVectorConfig();
            if (configData?.plugins["reports"]) {
                apiUrl = configData?.plugins["reports"].api;
            }
            try {
                const response = await fetch(`${apiUrl}/api/template/get_document_list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id: userId }),
                });
                const data = await response.json();
                if (data?.document?.length === 0) return;
                setReports(() =>
                    data.document.map(
                        ({
                            id: id,
                            document_name: title,
                            updated_at: timestamp,
                            status: status
                        }: {
                            id: string;
                            document_name: string;
                            updated_at: string;
                            status: string;
                        }) => ({ id, title, timestamp,status }),
                    ),
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchReportsData();
    }, [userId]);

    return (
        <div className="max-w-screen-lg mx-auto px-3 py-6">
            <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Reports Manager</h2>
                    <p className="text-muted-foreground text-base">
                        Create new reports and view/manage previously created reports.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="font-semibold" onClick={onNewReport} size="sm">
                        <Icon name="SquarePen" className="mr-2" />
                        New Report
                    </Button>
                </div>
            </div>
            {reports.length > 0 ? (
                <ReportsTable reports={reports} />
            ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">No existing reports found.</div>
            )}
        </div>
    );
};
