import React, { useEffect, useState } from "react";
import { Provider, createStore } from "jotai";

import { init as initRouting } from "../../vector/routing";
import { getVectorConfig } from "../../vector/getconfig";
import type { Template, File } from "@/plugins/reports/types";

import { Home } from "@/components/reports/Home";
import { apiUrlAtom } from "@/plugins/reports/stores/store";

// Initialise reports store
export const reportsStore = createStore();

export const MainPanel = (): JSX.Element => {
    // State to store files and templates
    const [files, setFiles] = useState<File[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);

    useEffect(() => {
        initRouting();

        const fetchFilesData = async (apiUrl: string): Promise<void> => {
            try {
                const response = await fetch(`${apiUrl}/files`);
                const data = await response.json();
                setFiles([...data]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchTemplatesData = async (apiUrl: string): Promise<void> => {
            try {
                const response = await fetch(`${apiUrl}/templates`);
                const data = await response.json();
                setTemplates([...data]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const getConfig = async (): Promise<void> => {
            const configData = await getVectorConfig();
            if (configData?.plugins["reports"]) {
                const apiUrl: string | null = configData?.plugins["reports"].api;
                apiUrl && (await fetchFilesData(apiUrl));
                apiUrl && (await fetchTemplatesData(apiUrl));
                apiUrl && reportsStore.set(apiUrlAtom, apiUrl);
            }
        };

        getConfig();
    }, []);
    return (
        <>
            <Provider store={reportsStore}>
                <Home files={files} templates={templates} />
            </Provider>
        </>
    );
};
