import { Plugin } from "../plugin";
import { MainPanel } from "./MainPanel";

import { IconFileChart } from "@/components/ui/icons";

export const ReportsPlugin: Plugin = {
    name: "reports",
    label: "Reports",
    Icon: IconFileChart,
    MainPanel: MainPanel,
};
