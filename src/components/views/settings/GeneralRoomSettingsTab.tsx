/*
Copyright 2019 New Vector Ltd

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

import React, { ContextType } from "react";
import { EventType, Room } from "matrix-js-sdk/src/matrix";
import { _t } from "matrix-react-sdk/src/languageHandler";
import RoomProfileSettings from "matrix-react-sdk/src/components/views/room_settings/RoomProfileSettings";
import AccessibleButton, { ButtonEvent } from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { UIFeature } from "matrix-react-sdk/src/settings/UIFeature";
import UrlPreviewSettings from "matrix-react-sdk/src/components/views/room_settings/UrlPreviewSettings";
import AliasSettings from "matrix-react-sdk/src/components/views/room_settings/AliasSettings";
import PosthogTrackers from "matrix-react-sdk/src/PosthogTrackers";
import SettingsSubsection from "matrix-react-sdk/src/components/views/settings/shared/SettingsSubsection";
import SettingsTab from "matrix-react-sdk/src/components/views/settings/tabs/SettingsTab";
import { SettingsSection } from "matrix-react-sdk/src/components/views/settings/shared/SettingsSection";

interface IProps {
    room: Room;
}

interface IState {
    isRoomPublished: boolean;
}

export default class GeneralRoomSettingsTab extends React.Component<IProps, IState> {
    public static contextType = MatrixClientContext;
    public context!: ContextType<typeof MatrixClientContext>;

    public constructor(props: IProps, context: ContextType<typeof MatrixClientContext>) {
        super(props, context);

        this.state = {
            isRoomPublished: false, // loaded async
        };
    }

    private onLeaveClick = (ev: ButtonEvent): void => {
        dis.dispatch({
            action: "leave_room",
            room_id: this.props.room.roomId,
        });

        PosthogTrackers.trackInteraction("WebRoomSettingsLeaveButton", ev);
    };

    public render(): React.ReactNode {
        const client = this.context;
        const room = this.props.room;

        const canSetAliases = true; // Previously, we arbitrarily only allowed admins to do this
        const canSetCanonical = room.currentState.mayClientSendStateEvent("m.room.canonical_alias", client);
        const canonicalAliasEv = room.currentState.getStateEvents("m.room.canonical_alias", "") ?? undefined;
        
        const nameEvent = room.currentState.getStateEvents(EventType.RoomName, "");
        const name = nameEvent && nameEvent.getContent() ? nameEvent.getContent()["name"] : "";

        const urlPreviewSettings = SettingsStore.getValue(UIFeature.URLPreviews) ? (
            <UrlPreviewSettings room={room} />
        ) : null;

        let leaveSection;
        if (room.getMyMembership() === "join") {
            leaveSection = (
                <SettingsSubsection heading={_t("action|leave_room")}>
                    <AccessibleButton kind="danger" onClick={this.onLeaveClick}>
                        {_t("action|leave_room")}
                    </AccessibleButton>
                </SettingsSubsection>
            );
        }

        return (
            <SettingsTab data-testid="General">
                { name && (
                    <SettingsSection heading={_t("common|general")}>
                        <RoomProfileSettings roomId={room.roomId} />
                    </SettingsSection>
                )}
                

                <SettingsSection heading={_t("room_settings|general|aliases_section")}>
                    <AliasSettings
                        roomId={room.roomId}
                        canSetCanonicalAlias={canSetCanonical}
                        canSetAliases={canSetAliases}
                        canonicalAliasEvent={canonicalAliasEv}
                    />
                </SettingsSection>

                <SettingsSection heading={_t("room_settings|general|other_section")}>
                    {urlPreviewSettings}
                    {leaveSection}
                </SettingsSection>
            </SettingsTab>
        );
    }
}
