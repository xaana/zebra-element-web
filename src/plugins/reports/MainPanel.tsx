import React, { useEffect } from "react";
import { Provider, createStore } from "jotai";
import { Toaster } from "sonner";

import { init as initRouting } from "../../vector/routing";
import { getVectorConfig } from "../../vector/getconfig";

import { Home } from "@/components/reports/Home";
import { apiUrlAtom } from "@/plugins/reports/stores/store";

// Initialise reports store
export const reportsStore = createStore();

export const MainPanel = (): JSX.Element => {
    useEffect(() => {
        initRouting();

        const getConfig = async (): Promise<void> => {
            const configData = await getVectorConfig();
            if (configData?.plugins["reports"]) {
                const apiUrl: string | null = configData?.plugins["reports"].api;
                apiUrl && reportsStore.set(apiUrlAtom, apiUrl);
            }
        };

        getConfig();
    }, []);
    return (
        <>
            <Toaster />
            <Provider store={reportsStore}>
                <Home />
            </Provider>
        </>
    );
};
