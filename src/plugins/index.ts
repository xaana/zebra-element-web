import { ActionPayload } from "matrix-react-sdk/src/dispatcher/payloads";
import { VideoPlugin } from "./video";
import { FilesPlugin } from "./files";

export * from "./plugin";

export const pluginList = [
    VideoPlugin,
    FilesPlugin,
];

export interface PluginActionPayload extends ActionPayload {
    plugin: string;
}

export const getPlugin = (name: string) => pluginList.find(plugin => plugin.name === name);

export enum PluginActions {
    LoadPlugin = "LOAD_PLUGIN",
    UnloadPlugin = "UNLOAD_PLUGIN",
}