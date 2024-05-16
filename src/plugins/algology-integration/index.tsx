import { Plugin } from "../plugin";
import { MainPanel } from "./MainPanel";

import { IconAlgology } from "@/components/ui/icons";

export const AlgologyIntegrationPlugin: Plugin = {
    name: "algology",
    label: "Algology",
    Icon: IconAlgology,
    MainPanel: MainPanel,
};
