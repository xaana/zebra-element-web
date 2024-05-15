import React from "react";

export interface Plugin {
    name: string;
    label?: string;
    Icon: React.FC;
    MainPanel: React.FC;
    LeftPanel?: React.FC;
}
