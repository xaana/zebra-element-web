import React, { useEffect } from "react";
import { Toaster } from "sonner";

import { init as initRouting } from "@/vector/routing";
import { Reports } from "@/components/reports";
import { TooltipProvider } from "@/components/ui/tooltip";

export const MainPanel = (): JSX.Element => {
    useEffect(() => {
        initRouting();
    }, []);

    return (
        <>
            {/* <Toaster className="!pointer-events-auto" /> */}
            <TooltipProvider>
                <Reports />
            </TooltipProvider>
        </>
    );
};
