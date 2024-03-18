import { Plugin } from "../plugin";
import { MainPanel } from "./MainPanel";

// import { IconFileChartFill } from "@/components/ui/icons";

export const ReportsPlugin: Plugin = {
    name: "reports",
    label: "Reports",
    // icon: IconFileChartFill,
    MainPanel: MainPanel,
};
