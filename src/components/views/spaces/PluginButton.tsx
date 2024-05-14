import React from "react";
import classNames from "classnames";
import SpaceStore from "matrix-react-sdk/src/stores/spaces/SpaceStore";
import defaultDispatcher from "matrix-react-sdk/src/dispatcher/dispatcher";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";
import { ButtonEvent } from "matrix-react-sdk/src/components/views/elements/AccessibleButton";

import { Plugin, PluginActions } from "../../../plugins";
// import { PluginIcon } from "./PluginIcon";

import { cn } from "@/lib/utils";
// import { Icon } from "@/components/ui/Icon";

interface PluginButtonProps extends Omit<Plugin, "MainPanel" | "LeftPanel"> {
    isPanelCollapsed: boolean;
    onClick?: (e: ButtonEvent) => void;
    activeSpace?: string;
    className?: string;
    children?: React.ReactNode;
    size?: string;
    spaceKey?: string;
    selected?: boolean;
    // Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const PluginButton = ({
    name,
    isPanelCollapsed,
    // Icon,
    label,
    onClick,
    activeSpace,
    className,
    children,
    spaceKey,
    selected,
    ...props
}: PluginButtonProps): JSX.Element => {
    const pluginSpaceName = `plugin.${name}`;

    const title = label ?? name;

    return (
        <li
            className={classNames("mx_SpaceItem", {
                collapsed: isPanelCollapsed,
            })}
            role="treeitem"
            aria-selected={selected}
        >
            <AccessibleTooltipButton
                className={cn("mx_SpaceButton", className, {
                    mx_SpaceButton_active: selected,
                    mx_SpaceButton_narrow: isPanelCollapsed,
                })}
                title={title}
                forceHide={!isPanelCollapsed}
                tabIndex={-1}
                onClick={(e) => {
                    SpaceStore.instance.setActiveSpace(pluginSpaceName);
                    defaultDispatcher.dispatch({ action: PluginActions.LoadPlugin, plugin: name });
                    window.location.hash = `#/plugins/${name}`;
                    onClick && onClick(e);
                }}
            >
                {children}
                <div className="mx_SpaceButton_selectionWrapper">
                    <div className="mx_SpaceButton_avatarWrapper">
                        <div className="mx_SpaceButton_avatarPlaceholder">
                            <div
                                className="mx_SpaceButton_icon flex justify-center items-center"
                                style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                            >
                                {props.icon({ className: "w-5 h-5", fill: "var(--cpd-color-text-secondary)" })}
                                {/* <Icon name="Plug" className="w-5 h-5 fill-[var(--cpd-color-text-secondary)]" /> */}
                            </div>
                        </div>
                    </div>
                    {!isPanelCollapsed && <span className="mx_SpaceButton_name">{label}</span>}
                </div>
            </AccessibleTooltipButton>
            {/* <div className="py-1">
                <div
                    className={classNames("flex place-content-center rounded-lg ml-3 cursor-pointer", {
                        "p-1": !selected,
                        "bg-zinc-200 p-1": selected && !isPanelCollapsed,
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
                        className={classNames(
                            "flex justify-center bg-gray-300/50 rounded-lg p-2 text-gray-500 w-4 h-4",
                            {
                                "!border-black border-[3px] p-1 border-solid": selected && isPanelCollapsed,
                            },
                        )}
                    >
                        <div className="w-6 h-6">
                            <Icon />
                        </div>
                    </div>
                    {!isPanelCollapsed && <div className="ml-2">{title}</div>}
                </div>
            </div> */}
        </li>
    );
};
