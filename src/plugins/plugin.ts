import React from "react";

export interface Plugin {
    name: string;
    label?: string;
    // icon: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => JSX.Element;
    // icon: React.FC;
    MainPanel: React.FC;
    LeftPanel?: React.FC;
}
