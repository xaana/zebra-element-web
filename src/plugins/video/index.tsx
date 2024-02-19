import React from "react";
import { Plugin } from '../plugin';
import { MainPanel } from './MainPanel';
import { Icon } from "./icon.svg";

export const VideoPlugin: Plugin = {
  name: 'video',
  label: 'Video',
  Icon: () => <Icon className="zexa-fill-current" />,
  MainPanel: () => <MainPanel />,
};