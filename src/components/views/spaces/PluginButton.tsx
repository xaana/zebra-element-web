import React from "react";
import classNames from "classnames";
import SpaceStore from "matrix-react-sdk/src/stores/spaces/SpaceStore";
import { Plugin, PluginActions } from '../../../plugins';
import defaultDispatcher from 'matrix-react-sdk/src/dispatcher/dispatcher';

interface PluginButtonProps extends Omit<Plugin, "MainPanel" | "LeftPanel"> {
  isPanelCollapsed: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  activeSpace?: string;
}

export const PluginButton = ({ name, isPanelCollapsed, Icon, label, onClick, activeSpace}: PluginButtonProps) => {
  const pluginSpaceName = `plugin.${name}`;

  const title = label?? name;
  const selected = activeSpace === pluginSpaceName;

  return (
    <li
        className={classNames("", {
            collapsed: isPanelCollapsed,
        })}
        role="treeitem"
        aria-selected={selected}
    >
      <div className="zexa-py-1">
        <div 
            className={classNames("zexa-flex zexa-place-content-center zexa-rounded-lg zexa-ml-3 zexa-cursor-pointer", {
                "zexa-p-1": !selected,
                "zexa-bg-zinc-200 zexa-p-1": selected && !isPanelCollapsed,
            })}
            onClick={(e) => {
                SpaceStore.instance.setActiveSpace(pluginSpaceName);
                defaultDispatcher.dispatch({ action: PluginActions.LoadPlugin, plugin: name });
                window.location.hash = `#/plugins/${name}`;
                if (onClick) {
                    onClick(e);
                }
            }}
        >
            <div 
                className={classNames("zexa-flex zexa-justify-center zexa-bg-gray-300/50 zexa-rounded-lg zexa-p-2 zexa-text-gray-500 zexa-w-4 zexa-h-4", {
                  "!zexa-border-black zexa-border-[3px] zexa-p-1 zexa-border-solid": selected && isPanelCollapsed,
                })}
            ><div className="zexa-w-6 zexa-h-6">
              <Icon />
              </div>
            </div>
            { !isPanelCollapsed && <div className="zexa-ml-2">{ title }</div> }
        </div>
      </div>
    </li>
  );
}