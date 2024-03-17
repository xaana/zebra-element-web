import React from "react";

export interface Plugin {
    name: string;
    label?: string;
    icon: ({ className, ...props }: React.SVGProps<SVGSVGElement>) => JSX.Element;
    MainPanel: React.FC;
    LeftPanel?: React.FC;
}
