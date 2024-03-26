import { ActionPayload } from "matrix-react-sdk/src/dispatcher/payloads";
import { SpaceKey } from "matrix-react-sdk/src/stores/spaces";

import { VideoPlugin } from "./video";
import { FilesPlugin } from "./files";
import { ReportsPlugin } from "./reports";
import { AlgologyIntegrationPlugin } from "./algology-integration";
import type { Plugin } from "./plugin";

export * from "./plugin";

export const pluginList: Plugin[] = [VideoPlugin, FilesPlugin, ReportsPlugin, AlgologyIntegrationPlugin];

export interface PluginActionPayload extends ActionPayload {
    plugin: string;
}

export const getPlugin = (name: string): Plugin | undefined => pluginList.find((plugin) => plugin.name === name);

export enum PluginActions {
    LoadPlugin = "LOAD_PLUGIN",
    UnloadPlugin = "UNLOAD_PLUGIN",
}

export function isActivePlugin(spaceKey: SpaceKey): boolean {
    return spaceKey.startsWith("plugin.") && pluginList.some((plugin) => spaceKey === `plugin.${plugin.name}`);
}
