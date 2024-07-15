import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { toast } from "sonner";

import type { AiGenerationContent, Report } from "@/plugins/reports/types";

import { CreateOrRenameDialog } from "@/components/reports/ReportsDisplay/ReportActions";
import { Loader } from "@/components/ui/LoaderAlt";
import CollaboraEditor from "@/components/reports/CollaboraEditor";
import { ReportsHome } from "@/components/reports/ReportsHome";
import { MimeTypeToExtensionMapping } from "@/plugins/files/types";

export const Reports = (): JSX.Element => {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null | undefined>(undefined);
    const stepRef = useRef(null);
    const client = useMatrixClientContext();
    const userId = client.getSafeUserId();
    const [isLoading, setIsLoading] = useState(false);
    const [nameDialogOpen, setNameDialogOpen] = useState(false);
    const [reportsFetched, setReportsFetched] = useState(false);
    const [allUsers, setAllUsers] = useState<string[]>([]);
    const [name, setName] = useState<string>("");

    const createNewReport = async (
        documentName?: string,
        initialContent?: string,
        aiContent?: AiGenerationContent,
        fileType?: string,
        name?: string,
    ): Promise<void> => {
        try {
            let fileName = "Untitled";
            if(name){
                fileName = name
            }else if (documentName) {
                fileName = documentName;
            }

            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/create_document`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: client.getSafeUserId(),
                    document_name: fileName,
                    file_type: fileType ?? "docx",
                }),
            });
            const data = await response.json();

            setIsLoading(false);

            const newReport: Report = {
                id: data.document_id.toString(),
                name: fileName,
                owner: client.getSafeUserId(),
                accessType: "admin",
                timestamp: new Date().toISOString(),
                ...(initialContent && {
                    content: initialContent,
                }),
                ...(aiContent && {
                    aiContent,
                }),
                fileType: fileType ?? "docx",
            };

            setReports((prev) => [...prev, newReport]);
            setSelectedReport(newReport);
        } catch (error) {
            console.error("Error creating document", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchUsers = async (): Promise<void> => {
            const url = `${SettingsStore.getValue("reportsApiUrl")}/api/get_users`;
            const request = new Request(url, {
                method: "GET",
            });
            fetch(request)
                .then((response) => response.json())
                .then((data) => {
                    data.user && setAllUsers(data.user.filter((item: string) => item !== "@zebra:securezebra.com"));
                });
        };
        fetchUsers();
    }, []);

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
                                file_type: fileType,
                            }: {
                                id: number;
                                document_name: string;
                                document_type: string;
                                owner: string;
                                permission_type: string;
                                status: string;
                                updated_at: Date;
                                file_type: string;
                            }) => ({
                                id: id.toString(),
                                name,
                                type,
                                owner,
                                status,
                                accessType,
                                timestamp: updatedAt,
                                fileType: fileType,
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

    const handleFileUpload = async (file: File,template?:boolean): Promise<void> => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("user_id", userId);
            formData.append("template",template? "Template" : "report");
            setIsLoading(true);
            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/upload_document`, {
                method: "POST",
                body: formData,
            });
            const responseData = await response.json();

            if (responseData?.status && responseData?.document_id) {
                setIsLoading(false);

                const newFileType = ["pdf", "doc", "docx", "odt", "rtf", "txt"].includes(
                    MimeTypeToExtensionMapping[file.type],
                )
                    ? "docx"
                    : "xlsx";
                const newReport: Report = {
                    id: responseData.document_id.toString(),
                    name: responseData.document_name,
                    owner: client.getSafeUserId(),
                    accessType: "admin",
                    timestamp: new Date().toISOString(),
                    fileType: newFileType,
                };

                setReports((prev) => [...prev, newReport]);
                setSelectedReport(newReport);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    };

    const handleDuplicate = async (reportId: string, aiContent?: AiGenerationContent, name?: string): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/duplicate_document`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: userId, document_id: reportId, name:name }),
            });
            const data = await response.json();

            if (data && data.status && data.document_id && data.document_name) {
                setIsLoading(false);

                const newReport: Report = {
                    id: data.document_id.toString(),
                    name: data.document_name,
                    owner: client.getSafeUserId(),
                    accessType: "admin",
                    timestamp: new Date().toISOString(),
                    ...(aiContent && {
                        aiContent,
                    }),
                    fileType: data.file_type ?? reports.find((r) => r.id === reportId)?.fileType ?? "docx",
                };

                setReports((prev) => [...prev, newReport]);
                setSelectedReport(newReport);
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
        if (aiContent.templateId !== undefined) {
            await handleDuplicate(aiContent.templateId, aiContent,name);
        } else {
            const reportTitle =
                aiContent.requirementDocuments && aiContent.requirementDocuments.length > 0
                    ? `Report for ${aiContent.requirementDocuments[0].name}`
                    : aiContent.allTitles.length > 0
                      ? aiContent.allTitles[0].substring(0, 30)
                      : "New Report";
            await createNewReport(reportTitle, undefined, aiContent,undefined,name);
        }
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
                toast.error("Error in renaming the document. Please try again later.", { closeButton: true });
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
                toast.error("Error in deleting the document. Please try again later.", { closeButton: true });
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
        toast.error("Failed to load document. Please try again later.", { closeButton: true });
    };

    return (
        <div className="h-full w-full overflow-auto">
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
                    <ReportsHome
                        reports={reports}
                        setSelectedReport={setSelectedReport}
                        userId={userId}
                        onCreateNewFromBlank={handleCreateNewFromBlank}
                        onFileUpload={handleFileUpload}
                        onRename={handleUpdateName}
                        onDuplicate={handleDuplicate}
                        onAiGenerate={handleAiGenerate}
                        onDelete={handleDeleteReport}
                        allUsers={allUsers}
                        name={name}
                        setName={setName}
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
                            currentUser={userId}
                            allUsers={allUsers}
                        />
                    </div>
                </motion.div>
            )}
            <CreateOrRenameDialog
                mode="create"
                open={nameDialogOpen}
                setOpen={setNameDialogOpen}
                onSubmit={(newName: string, fileType?: string) =>
                    createNewReport(newName, undefined, undefined, fileType)
                }
            />
        </div>
    );
};
