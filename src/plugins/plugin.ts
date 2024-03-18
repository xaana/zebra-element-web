import React from "react";

export interface Plugin {
    name: string;
    label?: string;
    icon: React.FC<React.SVGProps<SVGSVGElement> & { className?: string; fill?: string }>;
    MainPanel: React.FC;
    LeftPanel?: React.FC;
}
