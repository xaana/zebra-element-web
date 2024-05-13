import React from "react";

import { Loader } from "@/components/reports/Chat/loader";

export function MessageLoader(): JSX.Element {
    return (
        <div className="flex items-center rounded-md border bg-muted p-2 text-sm font-normal text-muted-foreground">
            <Loader /> Working...
        </div>
    );
}
