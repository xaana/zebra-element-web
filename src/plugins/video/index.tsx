import React from "react";
import { Plugin } from '../plugin';
import { MainPanel } from './MainPanel';
import {
  LuVideo,
} from "react-icons/lu";

export const VideoPlugin: Plugin = {
  name: 'video',
  label: 'Video',
  Icon: () => <LuVideo className="fill-current" />,
  MainPanel: () => <MainPanel />,
};