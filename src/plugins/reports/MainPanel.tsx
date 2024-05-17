import React, { useEffect, useMemo, useState } from "react";
import { Provider, createStore } from "jotai";
import { Toaster } from "sonner";
import { Doc as YDoc } from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { getVectorConfig } from "@/vector/getconfig";
import { init as initRouting } from "@/vector/routing";
import { Home } from "@/components/reports/Home";
import { TooltipProvider } from "@/components/ui/tooltip";

// Initialise reports store
export const reportsStore = createStore();

export const MainPanel = (): JSX.Element => {
    const client = useMatrixClientContext();

    useEffect(() => {
        initRouting();
    }, []);

    const ydoc = useMemo(() => new YDoc(), []);
    const [collabProvider, setCollabProvider] = useState<HocuspocusProvider | null>(null);
    // Set up the Hocuspocus WebSocket provider
    useEffect(() => {
        const setupCollab = async (): Promise<void> => {
            const configData = await getVectorConfig();
            if (configData?.plugins?.reports?.collabServer) {
                setCollabProvider(
                    new HocuspocusProvider({
                        url: configData.plugins.reports.collabServer,
                        name: client.getSafeUserId(),
                        document: ydoc,
                        token: "1234",
                    }),
                );
            }
        };

        setupCollab();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <Toaster />
            <Provider store={reportsStore}>
                <TooltipProvider>
                    {collabProvider ? (
                        <Home collabProvider={collabProvider} ydoc={ydoc} />
                    ) : (
                        <div>No hocuspocus server connected</div>
                    )}
                </TooltipProvider>
            </Provider>
        </>
    );
};
