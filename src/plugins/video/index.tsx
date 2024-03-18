import React from "react";

import { Plugin } from "../plugin";
import { MainPanel } from "./MainPanel";

// import { IconVideoFilled } from "@/components/ui/icons";

export const VideoPlugin: Plugin = {
    name: "video",
    label: "Video",
    // icon: IconVideoFilled,
    MainPanel: () => <MainPanel />,
};
