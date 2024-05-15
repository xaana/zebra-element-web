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

import React, { useContext } from "react";
import { Room } from "matrix-js-sdk/src/matrix";

import { IProps as IContextMenuProps } from "matrix-react-sdk/src/components/structures/ContextMenu";
import IconizedContextMenu, {
    IconizedContextMenuCheckbox,
    IconizedContextMenuOption,
    IconizedContextMenuOptionList,
} from "matrix-react-sdk/src/components/views/context_menus/IconizedContextMenu";
import { _t } from "matrix-react-sdk/src/languageHandler";
import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { ButtonEvent } from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import { DefaultTagID, TagID } from "matrix-react-sdk/src/stores/room-list/models";
import RoomListStore, { LISTS_UPDATE_EVENT } from "matrix-react-sdk/src/stores/room-list/RoomListStore";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { EchoChamber } from "matrix-react-sdk/src/stores/local-echo/EchoChamber";
import { RoomNotifState } from "matrix-react-sdk/src/RoomNotifs";
import Modal from "matrix-react-sdk/src/Modal";
import ExportDialog from "matrix-react-sdk/src/components/views/dialogs/ExportDialog";
import { useFeatureEnabled } from "matrix-react-sdk/src/hooks/useSettings";
import { usePinnedEvents } from "matrix-react-sdk/src/components/views/right_panel/PinnedMessagesCard";
import { RightPanelPhases } from "matrix-react-sdk/src/stores/right-panel/RightPanelStorePhases";
import { RoomSettingsTab } from "matrix-react-sdk/src/components/views/dialogs/RoomSettingsDialog";
import { useEventEmitterState } from "matrix-react-sdk/src/hooks/useEventEmitter";
import RightPanelStore from "matrix-react-sdk/src/stores/right-panel/RightPanelStore";
import DMRoomMap from "matrix-react-sdk/src/utils/DMRoomMap";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import PosthogTrackers from "matrix-react-sdk/src/PosthogTrackers";
import { ViewRoomPayload } from "matrix-react-sdk/src/dispatcher/payloads/ViewRoomPayload";
import { getKeyBindingsManager } from "matrix-react-sdk/src/KeyBindingsManager";
import { KeyBindingAction } from "matrix-react-sdk/src/accessibility/KeyboardShortcuts";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { SdkContextClass } from "matrix-react-sdk/src/contexts/SDKContext";
import { shouldShowComponent } from "matrix-react-sdk/src/customisations/helpers/UIComponents";
import { UIComponent } from "matrix-react-sdk/src/settings/UIFeature";
import { DeveloperToolsOption } from "matrix-react-sdk/src/components/views/context_menus/DeveloperToolsOption";
import { tagRoom } from "matrix-react-sdk/src/utils/room/tagRoom";

interface IProps extends IContextMenuProps {
    room: Room;
}

/**
 * Room context menu accessible via the room header.
 * @deprecated will be removed as part of `feature_new_room_decoration_ui`
 */
const RoomContextMenu: React.FC<IProps> = ({ room, onFinished, ...props }) => {
    const cli = useContext(MatrixClientContext);
    const roomTags = useEventEmitterState(RoomListStore.instance, LISTS_UPDATE_EVENT, () =>
        RoomListStore.instance.getTagsForRoom(room),
    );

    let leaveOption: JSX.Element | undefined;
    if (roomTags.includes(DefaultTagID.Archived)) {
        const onForgetRoomClick = (ev: ButtonEvent): void => {
            ev.preventDefault();
            ev.stopPropagation();

            dis.dispatch({
                action: "forget_room",
                room_id: room.roomId,
            });
            onFinished();
        };

        leaveOption = (
            <IconizedContextMenuOption
                iconClassName="mx_RoomTile_iconSignOut"
                label={_t("room|context_menu|forget")}
                className="mx_IconizedContextMenu_option_red"
                onClick={onForgetRoomClick}
            />
        );
    } else {
        const onLeaveRoomClick = (ev: ButtonEvent): void => {
            ev.preventDefault();
            ev.stopPropagation();

            dis.dispatch({
                action: "leave_room",
                room_id: room.roomId,
            });
            onFinished();

            PosthogTrackers.trackInteraction("WebRoomHeaderContextMenuLeaveItem", ev);
        };

        leaveOption = (
            <IconizedContextMenuOption
                onClick={onLeaveRoomClick}
                label={_t("action|leave")}
                className="mx_IconizedContextMenu_option_red"
                iconClassName="mx_RoomTile_iconSignOut"
            />
        );
    }

    const isDm = DMRoomMap.shared().getUserIdForRoomId(room.roomId);
    const videoRoomsEnabled = useFeatureEnabled("feature_video_rooms");
    const elementCallVideoRoomsEnabled = useFeatureEnabled("feature_element_call_video_rooms");
    const isVideoRoom =
        videoRoomsEnabled && (room.isElementVideoRoom() || (elementCallVideoRoomsEnabled && room.isCallRoom()));

    let inviteOption: JSX.Element | undefined;
    if (room.canInvite(cli.getUserId()!) && !isDm && shouldShowComponent(UIComponent.InviteUsers)) {
        const onInviteClick = (ev: ButtonEvent): void => {
            ev.preventDefault();
            ev.stopPropagation();

            dis.dispatch({
                action: "view_invite",
                roomId: room.roomId,
            });
            onFinished();

            PosthogTrackers.trackInteraction("WebRoomHeaderContextMenuInviteItem", ev);
        };

        inviteOption = (
            <IconizedContextMenuOption
                onClick={onInviteClick}
                label={_t("action|invite")}
                iconClassName="mx_RoomTile_iconInvite"
            />
        );
    }

    let favouriteOption: JSX.Element | undefined;
    let lowPriorityOption: JSX.Element | undefined;
    let notificationOption: JSX.Element | undefined;
    if (room.getMyMembership() === "join") {
        const isFavorite = roomTags.includes(DefaultTagID.Favourite);
        favouriteOption = (
            <IconizedContextMenuCheckbox
                onClick={(e) => {
                    onTagRoom(e, DefaultTagID.Favourite);
                    PosthogTrackers.trackInteraction("WebRoomHeaderContextMenuFavouriteToggle", e);
                }}
                active={isFavorite}
                label={isFavorite ? _t("context_menu|unfavourite") : _t("context_menu|favourite")}
                iconClassName="mx_RoomTile_iconPins"
            />
        );

        const isLowPriority = roomTags.includes(DefaultTagID.LowPriority);
        lowPriorityOption = (
            <IconizedContextMenuCheckbox
                onClick={(e) => onTagRoom(e, DefaultTagID.LowPriority)}
                active={isLowPriority}
                label={_t("common|low_priority")}
                iconClassName="mx_RoomTile_iconArrowDown"
            />
        );

        const echoChamber = EchoChamber.forRoom(room);
        let notificationLabel: string | undefined;
        let iconClassName: string | undefined;
        switch (echoChamber.notificationVolume) {
            case RoomNotifState.AllMessages:
                notificationLabel = _t("notifications|default");
                iconClassName = "mx_RoomTile_iconNotificationsDefault";
                break;
            case RoomNotifState.AllMessagesLoud:
                notificationLabel = _t("notifications|all_messages");
                iconClassName = "mx_RoomTile_iconNotificationsAllMessages";
                break;
            case RoomNotifState.MentionsOnly:
                notificationLabel = _t("room|context_menu|mentions_only");
                iconClassName = "mx_RoomTile_iconNotificationsMentionsKeywords";
                break;
            case RoomNotifState.Mute:
                notificationLabel = _t("common|mute");
                iconClassName = "mx_RoomTile_iconNotificationsNone";
                break;
        }

        notificationOption = (
            <IconizedContextMenuOption
                onClick={(ev: ButtonEvent) => {
                    ev.preventDefault();
                    ev.stopPropagation();

                    dis.dispatch({
                        action: "open_room_settings",
                        room_id: room.roomId,
                        initial_tab_id: RoomSettingsTab.Notifications,
                    });
                    onFinished();

                    PosthogTrackers.trackInteraction("WebRoomHeaderContextMenuNotificationsItem", ev);
                }}
                label={_t("notifications|enable_prompt_toast_title")}
                iconClassName={iconClassName}
            >
                <span className="mx_IconizedContextMenu_sublabel">{notificationLabel}</span>
            </IconizedContextMenuOption>
        );
    }

    let peopleOption: JSX.Element | undefined;
    let copyLinkOption: JSX.Element | undefined;
    if (!isDm) {
        peopleOption = (
            <IconizedContextMenuOption
                onClick={(ev: ButtonEvent) => {
                    ev.preventDefault();
                    ev.stopPropagation();

                    ensureViewingRoom(ev);
                    RightPanelStore.instance.pushCard({ phase: RightPanelPhases.RoomMemberList }, false);
                    onFinished();
                    PosthogTrackers.trackInteraction("WebRoomHeaderContextMenuPeopleItem", ev);
                }}
                label={_t("common|people")}
                iconClassName="mx_RoomTile_iconPeople"
            >
                <span className="mx_IconizedContextMenu_sublabel">{room.getJoinedMemberCount()}</span>
            </IconizedContextMenuOption>
        );

        copyLinkOption = (
            <IconizedContextMenuOption
                onClick={(ev: ButtonEvent) => {
                    ev.preventDefault();
                    ev.stopPropagation();

                    dis.dispatch({
                        action: "copy_room",
                        room_id: room.roomId,
                    });
                    onFinished();
                }}
                label={_t("room|context_menu|copy_link")}
                iconClassName="mx_RoomTile_iconCopyLink"
            />
        );
    }

    let filesOption: JSX.Element | undefined;
    if (!isVideoRoom) {
        filesOption = (
            <IconizedContextMenuOption
                onClick={(ev: ButtonEvent) => {
                    ev.preventDefault();
                    ev.stopPropagation();

                    ensureViewingRoom(ev);
                    RightPanelStore.instance.pushCard({ phase: RightPanelPhases.FilePanel }, false);
                    onFinished();
                }}
                label={_t("right_panel|files_button")}
                iconClassName="mx_RoomTile_iconFiles"
            />
        );
    }

    const pinningEnabled = useFeatureEnabled("feature_pinning");
    const pinCount = usePinnedEvents(pinningEnabled ? room : undefined)?.length;

    let pinsOption: JSX.Element | undefined;
    if (pinningEnabled && !isVideoRoom) {
        pinsOption = (
            <IconizedContextMenuOption
                onClick={(ev: ButtonEvent) => {
                    ev.preventDefault();
                    ev.stopPropagation();

                    ensureViewingRoom(ev);
                    RightPanelStore.instance.pushCard({ phase: RightPanelPhases.PinnedMessages }, false);
                    onFinished();
                }}
                label={_t("right_panel|pinned_messages_button")}
                iconClassName="mx_RoomTile_iconPins"
            >
                {pinCount > 0 && <span className="mx_IconizedContextMenu_sublabel">{pinCount}</span>}
            </IconizedContextMenuOption>
        );
    }

    let widgetsOption: JSX.Element | undefined;
    if (!isVideoRoom) {
        widgetsOption = (
            <IconizedContextMenuOption
                onClick={(ev: ButtonEvent) => {
                    ev.preventDefault();
                    ev.stopPropagation();

                    ensureViewingRoom(ev);
                    RightPanelStore.instance.setCard({ phase: RightPanelPhases.RoomSummary }, false);
                    onFinished();
                }}
                label={_t("right_panel|widgets_section")}
                iconClassName="mx_RoomTile_iconWidgets"
            />
        );
    }

    let exportChatOption: JSX.Element | undefined;
    if (!isVideoRoom) {
        exportChatOption = (
            <IconizedContextMenuOption
                onClick={(ev: ButtonEvent) => {
                    ev.preventDefault();
                    ev.stopPropagation();

                    Modal.createDialog(ExportDialog, { room });
                    onFinished();
                }}
                label={_t("right_panel|export_chat_button")}
                iconClassName="mx_RoomTile_iconExport"
            />
        );
    }

    const onTagRoom = (ev: ButtonEvent, tagId: TagID): void => {
        ev.preventDefault();
        ev.stopPropagation();

        tagRoom(room, tagId);

        const action = getKeyBindingsManager().getAccessibilityAction(ev as React.KeyboardEvent);
        switch (action) {
            case KeyBindingAction.Enter:
                // Implements https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-12
                onFinished();
                break;
        }
    };

    const ensureViewingRoom = (ev: ButtonEvent): void => {
        if (SdkContextClass.instance.roomViewStore.getRoomId() === room.roomId) return;
        dis.dispatch<ViewRoomPayload>(
            {
                action: Action.ViewRoom,
                room_id: room.roomId,
                metricsTrigger: "RoomList",
                metricsViaKeyboard: ev.type !== "click",
            },
            true,
        );
    };

    return (
        <IconizedContextMenu {...props} onFinished={onFinished} className="mx_RoomTile_contextMenu" compact>
            <IconizedContextMenuOptionList>
                {inviteOption}
                {notificationOption}
                {favouriteOption}
                {peopleOption}
                {filesOption}
                {pinsOption}
                {widgetsOption}
                {lowPriorityOption}
                {/* {copyLinkOption} */}

                <IconizedContextMenuOption
                    onClick={(ev: ButtonEvent) => {
                        ev.preventDefault();
                        ev.stopPropagation();

                        dis.dispatch({
                            action: "open_room_settings",
                            room_id: room.roomId,
                        });
                        onFinished();
                        PosthogTrackers.trackInteraction("WebRoomHeaderContextMenuSettingsItem", ev);
                    }}
                    label={_t("common|settings")}
                    iconClassName="mx_RoomTile_iconSettings"
                />

                {exportChatOption}

                {SettingsStore.getValue("developerMode") && (
                    <DeveloperToolsOption onFinished={onFinished} roomId={room.roomId} />
                )}

                {leaveOption}
            </IconizedContextMenuOptionList>
        </IconizedContextMenu>
    );
};

export default RoomContextMenu;
