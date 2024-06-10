import React, { useEffect } from "react";
import { Toaster } from "sonner";

import { init as initRouting } from "@/vector/routing";
import { Home } from "@/components/reports/Home";
import { TooltipProvider } from "@/components/ui/tooltip";

export const MainPanel = (): JSX.Element => {
    useEffect(() => {
        initRouting();
    }, []);

    return (
        <>
            <Toaster />
            <TooltipProvider>
                <Home />
            </TooltipProvider>
        </>
    );
};
