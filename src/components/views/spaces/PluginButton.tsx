import React from "react";
import classNames from "classnames";
import SpaceStore from "matrix-react-sdk/src/stores/spaces/SpaceStore";
import { SpaceKey, UPDATE_SELECTED_SPACE } from 'matrix-react-sdk/src/stores/spaces';
import { useEventEmitterState } from 'matrix-react-sdk/src/hooks/useEventEmitter';
import { Plugin, PluginActions } from '../../../plugins';
import defaultDispatcher from 'matrix-react-sdk/src/dispatcher/dispatcher';

interface PluginButtonProps extends Omit<Plugin, "MainPanel" | "LeftPanel"> {
  isPanelCollapsed: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const PluginButton = ({ name, isPanelCollapsed, Icon, label, onClick}: PluginButtonProps) => {
  const activeSpace = useEventEmitterState<SpaceKey>(SpaceStore.instance, UPDATE_SELECTED_SPACE, (space) => space);

  const title = label?? name;
  const selected = activeSpace === `plugin.${name}`;

  return (
    <li
        className={classNames("", {
            collapsed: isPanelCollapsed,
        })}
        role="treeitem"
        aria-selected={selected}
    >
      <div className="py-1">        
        <div 
            className={classNames("flex items-center rounded-lg ml-4 cursor-pointer", {
                "p-1": !selected,
                "bg-zinc-200 p-1": selected && !isPanelCollapsed,
            })}
            onClick={(e) => {
                window.localStorage.setItem("mx_active_space", `plugin.${name}`);
                SpaceStore.instance.emit(UPDATE_SELECTED_SPACE, `plugin.${name}`);
                defaultDispatcher.dispatch({ action: PluginActions.LoadPlugin, plugin: name });
                if (onClick) {
                    onClick(e);
                }
            }}
        >
            <div 
                className={classNames("flex justify-center bg-gray-300/50 rounded-lg p-2 text-gray-500 w-4 h-4", {
                  "border-black border-[3px] p-1 border-solid": selected && isPanelCollapsed,
                })}
            >
              <Icon />
            </div>
            { !isPanelCollapsed && <div className="ml-2">{ title }</div> }
        </div>
      </div>
    </li>
  );
}