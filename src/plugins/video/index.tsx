import { Plugin } from "../plugin";
import { MainPanel } from "./MainPanel";
import { IconVideo } from "@/components/ui/icons";

export const VideoPlugin: Plugin = {
    name: "video",
    label: "Video",
    Icon: IconVideo,
    MainPanel: MainPanel,
};
