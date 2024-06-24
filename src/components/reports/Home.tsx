import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { toast } from "sonner";

import type { Report, AiGenerationContent } from "@/plugins/reports/types";

import { CreateOrRenameDialog } from "@/components/reports/ReportActions";
import { ReportSelector } from "@/components/reports/ReportSelector";
import { Loader } from "@/components/ui/LoaderAlt";
import CollaboraEditor from "@/components/reports/CollaboraEditor";

export const Home = (): JSX.Element => {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null | undefined>(undefined);
    const stepRef = useRef(null);
    const client = useMatrixClientContext();
    const userId = client.getSafeUserId();
    const [isLoading, setIsLoading] = useState(false);
    const [nameDialogOpen, setNameDialogOpen] = useState(false);
    const [reportsFetched, setReportsFetched] = useState(false);

    const createNewReport = async (
        initialContent?: string,
        documentName?: string,
        aiContent?: AiGenerationContent,
    ): Promise<void> => {
        try {
            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/create_document`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: client.getSafeUserId(), document_name: documentName ?? "Untitled" }),
            });
            const data = await response.json();

            setIsLoading(false);

            const newReport: Report = {
                id: data.document_id.toString(),
                name: documentName ?? "Untitled",
                owner: client.getSafeUserId(),
                accessType: "admin",
                timestamp: new Date().toISOString(),
                ...(initialContent && {
                    content: initialContent,
                }),
                ...(aiContent && {
                    aiContent,
                }),
            };

            setReports((prev) => [...prev, newReport]);
            setSelectedReport(newReport);
        } catch (error) {
            console.error("Error creating document", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchReports = async (): Promise<void> => {
            setReportsFetched(false);
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
                setReportsFetched(true);
            }
        };

        if (selectedReport === undefined) {
            fetchReports();
            return;
        } else if (selectedReport === null) {
            // New From Blank
            setNameDialogOpen(true);
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
                await createNewReport(combinedString);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    };

    const handleDuplicate = async (reportId: string): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/get_document_html`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ document_id: Number(reportId) }),
            });
            const data = await response.json();

            if (data && data.document_html && data.document_name) {
                await createNewReport(data.document_html, data.document_name);
            } else {
                console.error("Error fetching data:", data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error creating document", error);
            setIsLoading(false);
        }
    };

    const handleAiGenerate = async (aiContent: AiGenerationContent): Promise<void> => {
        await createNewReport(undefined, aiContent.allTitles[0].substring(0, 30), aiContent);
    };

    const handleUpdateName = async (reportId: string, name: string): Promise<boolean> => {
        try {
            const response = await fetch(
                `${SettingsStore.getValue("reportsApiUrl")}/api/reports/update_document_name`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ document_id: reportId, updated_name: name }),
                },
            );
            if (response.ok) {
                setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, name } : report)));
                return true;
            } else {
                toast.error("Error updating document name");
                return false;
            }
        } catch (error) {
            console.error("Error updating document name", error);
            return false;
        }
    };

    const handleDeleteReport = async (reportId: string): Promise<void> => {
        try {
            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/delete_document`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ document_id: reportId }),
            });
            if (response.ok) {
                setReports((prev) => prev.filter((report) => report.id !== reportId));
            } else {
                toast.error("Error updating document name");
            }
        } catch (error) {
            console.error("Error updating document name", error);
        }
    };

    const handleCloseEditor = (): void => {
        setSelectedReport(undefined);
    };

    const handleCreateNewFromBlank = (): void => {
        setNameDialogOpen(true);
    };

    const handleDocumentLoadFailed = (): void => {
        setSelectedReport(undefined);
        toast.error("Failed to load document. Please try again later.");
    };

    return (
        <div className="h-full w-full">
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
                        onCreateNewFromBlank={handleCreateNewFromBlank}
                        onFileUpload={handleFileUpload}
                        onRename={handleUpdateName}
                        onDuplicate={handleDuplicate}
                        onAiGenerate={handleAiGenerate}
                        onDelete={handleDeleteReport}
                    />
                </motion.div>
            )}
            {/* Various Scenarios - Show loader */}
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key="loader"
                    ref={stepRef}
                >
                    <div className="max-w-screen-lg mx-auto px-3 my-8">
                        <div className="w-full h-full flex justify-center items-center">
                            <Loader
                                label={isLoading && !reportsFetched ? "Loading Reports..." : "Creating Report..."}
                            />
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
                    <div className="overflow-hidden" style={{ height: "100vh", width: "calc(100vw - 68px)" }}>
                        <CollaboraEditor
                            onCloseEditor={handleCloseEditor}
                            selectedReport={selectedReport}
                            onDocumentLoadFailed={handleDocumentLoadFailed}
                        />
                    </div>
                </motion.div>
            )}
            <CreateOrRenameDialog
                mode="create"
                open={nameDialogOpen}
                setOpen={setNameDialogOpen}
                onSubmit={(newName: string) => createNewReport(undefined, newName)}
            />
        </div>
    );
};
