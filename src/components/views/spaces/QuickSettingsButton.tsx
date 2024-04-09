/*
Copyright 2021 - 2023 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from "react";
import classNames from "classnames";
import { _t } from "matrix-react-sdk/src/languageHandler";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";
import ContextMenu, { alwaysAboveRightOf, ChevronFace, useContextMenu } from "matrix-react-sdk/src/components/structures/ContextMenu";
import AccessibleButton from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import StyledCheckbox from "matrix-react-sdk/src/components/views/elements/StyledCheckbox";
import { MetaSpace } from "matrix-react-sdk/src/stores/spaces";
import { useSettingValue } from "matrix-react-sdk/src/hooks/useSettings";
import { onMetaSpaceChangeFactory } from "matrix-react-sdk/src/components/views/settings/tabs/user/SidebarUserSettingsTab";
import defaultDispatcher from "matrix-react-sdk/src/dispatcher/dispatcher";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import { UserTab } from "matrix-react-sdk/src/components/views/dialogs/UserTab";
import QuickThemeSwitcher from "matrix-react-sdk/src/components/views/spaces/QuickThemeSwitcher";
import { Icon as PinUprightIcon } from "matrix-react-sdk/res/img/element-icons/room/pin-upright.svg";
import { Icon as EllipsisIcon } from "matrix-react-sdk/res/img/element-icons/room/ellipsis.svg";
import { Icon as MembersIcon } from "matrix-react-sdk/res/img/element-icons/room/members.svg";
import { Icon as FavoriteIcon } from "matrix-react-sdk/res/img/element-icons/roomlist/favorite.svg";
import Modal from "matrix-react-sdk/src/Modal";
import DevtoolsDialog from "matrix-react-sdk/src/components/views/dialogs/DevtoolsDialog";
import { SdkContextClass } from "matrix-react-sdk/src/contexts/SDKContext";

const QuickSettingsButton: React.FC<{
    isPanelCollapsed: boolean;
}> = ({ isPanelCollapsed = false }) => {
    const [menuDisplayed, handle, openMenu, closeMenu] = useContextMenu<HTMLDivElement>();

    const { [MetaSpace.Favourites]: favouritesEnabled, [MetaSpace.People]: peopleEnabled } =
        useSettingValue<Record<MetaSpace, boolean>>("Spaces.enabledMetaSpaces");

    const currentRoomId = SdkContextClass.instance.roomViewStore.getRoomId();
    const developerModeEnabled = useSettingValue("developerMode");

    let contextMenu: JSX.Element | undefined;
    if (menuDisplayed && handle.current) {
        contextMenu = (
            <ContextMenu
                {...alwaysAboveRightOf(handle.current.getBoundingClientRect(), ChevronFace.None, 16)}
                wrapperClassName="mx_QuickSettingsButton_ContextMenuWrapper"
                onFinished={closeMenu}
                managed={false}
                focusLock={true}
            >
                <h2>{_t("quick_settings|title")}</h2>

                <AccessibleButton
                    onClick={() => {
                        closeMenu();
                        defaultDispatcher.dispatch({ action: Action.ViewUserSettings });
                    }}
                    kind="primary_outline"
                >
                    {_t("quick_settings|all_settings")}
                </AccessibleButton>

                {currentRoomId && developerModeEnabled && (
                    <AccessibleButton
                        onClick={() => {
                            closeMenu();
                            Modal.createDialog(
                                DevtoolsDialog,
                                {
                                    roomId: currentRoomId,
                                },
                                "mx_DevtoolsDialog_wrapper",
                            );
                        }}
                        kind="danger_outline"
                    >
                        {_t("devtools|title")}
                    </AccessibleButton>
                )}

                <h4 className="mx_QuickSettingsButton_pinToSidebarHeading">
                    <PinUprightIcon className="mx_QuickSettingsButton_icon" />
                    {_t("quick_settings|metaspace_section")}
                </h4>

                <StyledCheckbox
                    className="mx_QuickSettingsButton_favouritesCheckbox"
                    checked={!!favouritesEnabled}
                    onChange={onMetaSpaceChangeFactory(MetaSpace.Favourites, "WebQuickSettingsPinToSidebarCheckbox")}
                >
                    <FavoriteIcon className="mx_QuickSettingsButton_icon" />
                    {_t("common|favourites")}
                </StyledCheckbox>
                {/* <StyledCheckbox
                    className="mx_QuickSettingsButton_peopleCheckbox"
                    checked={!!peopleEnabled}
                    onChange={onMetaSpaceChangeFactory(MetaSpace.People, "WebQuickSettingsPinToSidebarCheckbox")}
                >
                    <MembersIcon className="mx_QuickSettingsButton_icon" />
                    {_t("common|people")}
                </StyledCheckbox> */}
                <AccessibleButton
                    className="mx_QuickSettingsButton_moreOptionsButton"
                    onClick={() => {
                        closeMenu();
                        defaultDispatcher.dispatch({
                            action: Action.ViewUserSettings,
                            initialTabId: UserTab.Sidebar,
                        });
                    }}
                >
                    <EllipsisIcon className="mx_QuickSettingsButton_icon" />
                    {_t("quick_settings|sidebar_settings")}
                </AccessibleButton>

                <QuickThemeSwitcher requestClose={closeMenu} />
            </ContextMenu>
        );
    }

    return (
        <>
            <AccessibleTooltipButton
                className={classNames("mx_QuickSettingsButton", { expanded: !isPanelCollapsed })}
                onClick={openMenu}
                title={_t("quick_settings|title")}
                ref={handle}
                forceHide={!isPanelCollapsed}
                aria-expanded={!isPanelCollapsed}
            >
                {!isPanelCollapsed ? _t("common|settings") : null}
            </AccessibleTooltipButton>

            {contextMenu}
        </>
    );
};

export default QuickSettingsButton;
