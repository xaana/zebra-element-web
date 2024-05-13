import React, { useEffect } from "react";
import { Provider, createStore } from "jotai";
import { Toaster } from "sonner";

import { init as initRouting } from "../../vector/routing";

import { Home } from "@/components/reports/Home";
import { TooltipProvider } from "@/components/ui/tooltip";

// Initialise reports store
export const reportsStore = createStore();

export const MainPanel = (): JSX.Element => {
    useEffect(() => {
        initRouting();
    }, []);
    return (
        <>
            <Toaster />
            <Provider store={reportsStore}>
                <TooltipProvider>
                    <Home />
                </TooltipProvider>
            </Provider>
        </>
    );
};
