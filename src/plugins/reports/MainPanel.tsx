import React, { useEffect } from "react";
import { Provider, createStore } from "jotai";

import { init as initRouting } from "../../vector/routing";

import { Home } from "@/components/reports/Home";

// Initialise reports store
export const reportsStore = createStore();

export const MainPanel = (): JSX.Element => {
    useEffect(() => {
        initRouting();
    }, []);
    return (
        <>
            <Provider store={reportsStore}>
                <Home />
            </Provider>
        </>
    );
};
