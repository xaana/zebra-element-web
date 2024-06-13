import { Plugin } from "../plugin";
import { MainPanel } from "./MainPanel";

import { IconAlgology } from "@/components/ui/icons";

export const StoragePlugin: Plugin = {
    name: "storage",
    label: "Storage",
    Icon: IconAlgology,
    MainPanel: MainPanel,
};
