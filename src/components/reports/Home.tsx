import React, { useEffect, useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Doc as YDoc } from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import type { Report } from "@/plugins/reports/types";

import { ReportSelector } from "@/components/reports/ReportSelector";
import { useBlockEditor } from "@/plugins/reports/hooks/useBlockEditor";
import { Chat, useChat } from "@/plugins/reports/hooks/use-chat";
import { ReportEditor } from "@/components/reports/ReportEditor";
import { useAIState } from "@/plugins/reports/hooks/useAIState";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import { useSidebar } from "@/plugins/reports/hooks/useSidebar";

export const Home = (): JSX.Element => {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null | undefined>(undefined);
    const stepRef = useRef(null);

    const client = useMatrixClientContext();
    const ydoc = useMemo(() => new YDoc(), []);

    // Set up the Hocuspocus WebSocket provider
    const collabProvider: HocuspocusProvider = useMemo(() => {
        return new HocuspocusProvider({
            url: `${SettingsStore.getValue("collabServerWebsocketUrl")}/collaboration`,
            name: "0",
            document: ydoc,
            connect: false,
            preserveConnection: true,
            onOpen(data): void {
                console.log("Connected to Hocuspocus server", data.event);
            },
            onMessage(data): void {
                console.log("Received message from Hocuspocus server", data.message);
            },
        });
    }, [ydoc]);

    const { editor, collabState, users } = useBlockEditor({
        collabProvider,
        ydoc,
    });

    const leftSidebar = useSidebar();
    const rightSidebar = useSidebar();

    const chat: Chat = useChat({
        isOpen: rightSidebar.isOpen,
        open: rightSidebar.open,
        close: rightSidebar.close,
        toggle: rightSidebar.toggle,
    });

    const aiState = useAIState();

    const providerValue = useMemo(() => {
        return {
            isAiLoading: aiState.isAiLoading,
            aiError: aiState.aiError,
            setIsAiLoading: aiState.setIsAiLoading,
            setAiError: aiState.setAiError,
            editor: editor,
            editorChat: chat,
            collabState: collabState,
            collabProvider: collabProvider,
            users: users,
        };
    }, [aiState, chat, editor, collabState, users, collabProvider]);

    useEffect(() => {
        const fetchReports = async (): Promise<void> => {
            try {
                const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/template/get_documents`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id: client.getSafeUserId() }),
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
                                id: string;
                                document_name: string;
                                document_type: string;
                                owner: string;
                                permission_type: string;
                                status: string;
                                updated_at: Date;
                            }) => ({
                                id,
                                name,
                                type,
                                owner,
                                status,
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

    useEffect(() => {
        const createNewReport = async (): Promise<void> => {
            try {
                const response = await fetch(`${SettingsStore.getValue("collabServerHttpUrl")}/create_document`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId: client.getSafeUserId(), documentName: "Untitled" }),
                });
                const data = await response.json();
                if (data?.documentId) {
                    collabProvider.setConfiguration({
                        name: data.documentId.toString(),
                        token: JSON.stringify({
                            userId: client.getSafeUserId(),
                            documentName: "Untitled",
                        }),
                    });
                    await collabProvider.connect();
                }
            } catch (error) {
                console.error("Error creating document", error);
            }
        };

        if (selectedReport === undefined) {
            collabProvider.disconnect();
            collabProvider.setConfiguration({ name: "0", parameters: undefined });
            return;
        } else if (selectedReport === null) {
            createNewReport();
        } else {
            collabProvider.setConfiguration({
                name: selectedReport.id,
                token: JSON.stringify({
                    userId: client.getSafeUserId(),
                    documentName: selectedReport.name,
                }),
            });
            collabProvider.connect();
        }
    }, [selectedReport]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <EditorContext.Provider value={providerValue}>
            <div className="h-full overflow-auto">
                {selectedReport === undefined && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key="none"
                        ref={stepRef}
                        className="max-w-screen-lg mx-auto px-3 my-8"
                    >
                        <ReportSelector
                            editor={editor}
                            reports={reports}
                            selectedReport={selectedReport}
                            setSelectedReport={setSelectedReport}
                        />
                    </motion.div>
                )}
                {selectedReport !== undefined && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={selectedReport ? selectedReport.id : "blank"}
                        ref={stepRef}
                    >
                        <ReportEditor
                            selectedReport={selectedReport}
                            onGoBack={() => setSelectedReport(undefined)}
                            editor={editor}
                            leftSidebar={leftSidebar}
                            rightSidebar={rightSidebar}
                        />
                    </motion.div>
                )}
            </div>
        </EditorContext.Provider>
    );
};
