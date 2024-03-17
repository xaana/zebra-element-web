import { ActionPayload } from "matrix-react-sdk/src/dispatcher/payloads";

import { VideoPlugin } from "./video";
import { FilesPlugin } from "./files";
import { ReportsPlugin } from "./reports";
import type { Plugin } from "./plugin";

export * from "./plugin";

export const pluginList = [VideoPlugin, FilesPlugin, ReportsPlugin];

export interface PluginActionPayload extends ActionPayload {
    plugin: string;
}

export const getPlugin = (name: string): Plugin | undefined => pluginList.find((plugin) => plugin.name === name);

export enum PluginActions {
    LoadPlugin = "LOAD_PLUGIN",
    UnloadPlugin = "UNLOAD_PLUGIN",
}
