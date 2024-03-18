import { Plugin } from "../plugin";
import { MainPanel } from "./MainPanel";

// import { IconDocumentDuplicate } from "@/components/ui/icons";

export const FilesPlugin: Plugin = {
    name: "files",
    label: "Files",
    // icon: IconDocumentDuplicate,
    MainPanel: MainPanel,
};
