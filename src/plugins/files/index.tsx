import React from "react";
import { Plugin } from "../plugin";
import { Icon } from "./icon.svg";
import { MainPanel } from './MainPanel';

export const FilesPlugin: Plugin = {
  name: "files",
  label: "Files",
  Icon: () => <Icon className="zexa-fill-current" />,
  MainPanel: MainPanel,
}