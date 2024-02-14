import React from "react";
import { Plugin } from '../plugin';
import App from './App';
import {
  LuVideo,
} from "react-icons/lu";

export const VideoPlugin: Plugin = {
  name: 'video',
  label: 'Video',
  Icon: () => <LuVideo className="fill-current" />,
  MainPanel: () => <App />,
};