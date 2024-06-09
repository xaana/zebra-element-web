import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import type { Report } from "@/plugins/reports/types";
import { CollaborationProvider } from "./CollaborationProvider";

import { ReportSelector } from "@/components/reports/ReportSelector";
import { Loader } from "@/components/ui/LoaderAlt";

export const Home = (): JSX.Element => {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null | undefined>(undefined);
    const stepRef = useRef(null);
    const client = useMatrixClientContext();
    const userId = client.getSafeUserId();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchReports = async (): Promise<void> => {
            try {
                const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/get_documents`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id: userId }),
                });
                const data = await response.json();
                if (data?.documents.length === 0) return;
                data.documents &&
                    setReports(
                        data.documents.map(
                            ({
                                id,
                                document_name: name,
                                document_type: type,
                                updated_at: updatedAt,
                                owner: owner,
                                permission_type: accessType,
                                status: status,
                            }: {
                                id: number;
                                document_name: string;
                                document_type: string;
                                owner: string;
                                permission_type: string;
                                status: string;
                                updated_at: Date;
                            }) => ({
                                id: id.toString(),
                                name,
                                type,
                                owner,
                                status,
                                accessType,
                                timestamp: updatedAt,
                            }),
                        ),
                    );
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchReports();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const createNewReport = async (initialContent?: string): Promise<void> => {
        try {
            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/create_document`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: client.getSafeUserId(), document_name: "Untitled" }),
            });
            const data = await response.json();

            isLoading && setIsLoading(false);

            setSelectedReport({
                id: data.document_id.toString(),
                name: "Untitled",
                owner: client.getSafeUserId(),
                accessType: "admin",
                timestamp: new Date().toISOString(),
                ...(initialContent && {
                    content: initialContent,
                }),
            });
        } catch (error) {
            console.error("Error creating document", error);
            isLoading && setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedReport === undefined) {
            return;
        } else if (selectedReport === null) {
            createNewReport();
            return;
        }
    }, [selectedReport]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleFileUpload = async (file: File): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append("files", file);
            setIsLoading(true);
            // Make API request
            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/extract/pdf`, {
                method: "POST",
                body: formData,
            });
            const responseData = await response.json();

            if (responseData?.html_pages?.length > 0) {
                const combinedString = responseData.html_pages.join("\n");
                createNewReport(combinedString);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full overflow-auto">
            {/* No report selected - Show report selector */}
            {selectedReport === undefined && (
                <motion.div
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="selector"
                    ref={stepRef}
                    className="max-w-screen-lg mx-auto px-3 my-8"
                >
                    <ReportSelector
                        reports={reports}
                        setSelectedReport={setSelectedReport}
                        userId={userId}
                        onFileUpload={handleFileUpload}
                    />
                </motion.div>
            )}
            {/* Null report selected - Show loader */}
            {(selectedReport === null || isLoading) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="loader"
                    ref={stepRef}
                >
                    <div className="max-w-screen-lg mx-auto px-3 my-8">
                        <div className="w-full h-full flex justify-center items-center">
                            <Loader label="Creating your report..." />
                        </div>
                    </div>
                </motion.div>
            )}
            {/* Report selected - Show report editor */}
            {selectedReport !== undefined && selectedReport !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={selectedReport.id}
                    ref={stepRef}
                >
                    <CollaborationProvider
                        userId={userId}
                        selectedReport={selectedReport}
                        setSelectedReport={setSelectedReport}
                    />
                </motion.div>
            )}
        </div>
    );
};
