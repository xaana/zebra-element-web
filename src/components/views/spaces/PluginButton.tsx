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
      <div className="zexa-py-1">
        <div 
            className={classNames("zexa-flex zexa-place-content-center zexa-rounded-lg zexa-ml-3 zexa-cursor-pointer", {
                "zexa-p-1": !selected,
                "zexa-bg-zinc-200 zexa-p-1": selected && !isPanelCollapsed,
            })}
            onClick={(e) => {
                window.localStorage.setItem("mx_active_space", `plugin.${name}`);
                // TODO: if we enabled line below space store will be empty, find a way
                // SpaceStore.instance.emit(UPDATE_SELECTED_SPACE, `plugin.${name}`);
                defaultDispatcher.dispatch({ action: PluginActions.LoadPlugin, plugin: name });
                window.location.hash = `#/plugins/${name}`;
                if (onClick) {
                    onClick(e);
                }
            }}
        >
            <div 
                className={classNames("zexa-flex zexa-justify-center zexa-p-1 zexa-bg-gray-300/50 zexa-rounded-[8px] zexa-text-gray-500", {
                  "zexa-border-black zexa-border-[3px] zexa-p-1 zexa-border-solid": selected && isPanelCollapsed,
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