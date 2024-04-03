import React, { useEffect, useState } from "react";
import { Provider, createStore } from "jotai";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { Toaster } from "sonner";

import { init as initRouting } from "../../vector/routing";
import { getVectorConfig } from "../../vector/getconfig";
import type { Template } from "@/plugins/reports/types";
import type { File } from "@/plugins/files/types";
import type { Report } from "@/components/reports/ReportsManager";

import { Home } from "@/components/reports/Home";
import { apiUrlAtom } from "@/plugins/reports/stores/store";
import { useFiles } from "@/lib/hooks/use-files";

// Initialise reports store
export const reportsStore = createStore();

export const MainPanel = (): JSX.Element => {
    // State to store files and templates
    const [reports, setReports] = useState<Report[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const { getUserFiles } = useFiles();
    const client = useMatrixClientContext();
    const userId: string = client.getSafeUserId();

    useEffect(() => {
        initRouting();

        const fetchReportsData = async (apiUrl: string): Promise<void> => {
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
                            document_name: name,
                            updated_at: createdAt,
                        }: {
                            id: string;
                            document_name: string;
                            updated_at: Date;
                        }) => ({ id, name, createdAt }),
                    ),
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchTemplatesData = async (apiUrl: string): Promise<void> => {
            try {
                const response = await fetch(`${apiUrl}/api/template/get_template_list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id: userId }),
                });
                const data = await response.json();
                if (data?.templates?.length === 0) return;
                setTemplates(() =>
                    data.templates.map(
                        ({
                            id: id,
                            template_name: name,
                            template_description: description,
                            updated_at: createdAt,
                        }: {
                            id: string;
                            template_name: string;
                            template_description: string;
                            updated_at: Date;
                        }) => ({ id, name, description: description ?? "", createdAt }),
                    ),
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const getConfig = async (): Promise<void> => {
            const configData = await getVectorConfig();
            if (configData?.plugins["reports"]) {
                const apiUrl: string | null = configData?.plugins["reports"].api;
                const fetchedFiles = await getUserFiles();
                // setFiles([...fetchedFiles]);
                setFiles(() => fetchedFiles.filter((file) => file.name.endsWith(".pdf")));
                apiUrl && (await fetchTemplatesData(apiUrl));
                apiUrl && (await fetchReportsData(apiUrl));
                apiUrl && reportsStore.set(apiUrlAtom, apiUrl);
            }
        };

        console.log("Calling getConfig()");

        getConfig();
    }, [getUserFiles, userId]);
    return (
        <>
            <Toaster />
            <Provider store={reportsStore}>
                <Home files={files} templates={templates} reports={reports} />
            </Provider>
        </>
    );
};
