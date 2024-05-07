/*
Copyright 2020 The Matrix.org Foundation C.I.C.

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

import * as React from "react";
import { useContext, useState } from "react";
import AutoHideScrollbar from "matrix-react-sdk/src/components/structures/AutoHideScrollbar";
import { getHomePageUrl } from "matrix-react-sdk/src/utils/pages";
import { _tDom } from "matrix-react-sdk/src/languageHandler";
import SdkConfig from "matrix-react-sdk/src/SdkConfig";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import BaseAvatar from "matrix-react-sdk/src/components/views/avatars/BaseAvatar";
import { OwnProfileStore } from "matrix-react-sdk/src/stores/OwnProfileStore";
import { UPDATE_EVENT } from "matrix-react-sdk/src/stores/AsyncStore";
import { useEventEmitter } from "matrix-react-sdk/src/hooks/useEventEmitter";
import MatrixClientContext, { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import MiniAvatarUploader, { AVATAR_SIZE } from "matrix-react-sdk/src/components/views/elements/MiniAvatarUploader";
import PosthogTrackers from "matrix-react-sdk/src/PosthogTrackers";
import EmbeddedPage from "matrix-react-sdk/src/components/structures/EmbeddedPage";
import { Search, File, Database, Headphones } from "lucide-react";
import { DirectoryMember, startDmOnFirstMessage } from "matrix-react-sdk/src/utils/direct-messages";
import { MessageComposer } from "matrix-react-sdk/src/components/views/rooms/MessageComposer";
import { findDMRoom } from "matrix-react-sdk/src/utils/dm/findDMRoom";
import ResizeNotifier from "matrix-react-sdk/src/utils/ResizeNotifier";
import classNames from "classnames";

import { Label } from "../ui/label";

interface IProps {
    justRegistered?: boolean;
}

const getOwnProfile = (
    userId: string,
): {
    displayName: string;
    avatarUrl?: string;
} => ({
    displayName: OwnProfileStore.instance.displayName || userId,
    avatarUrl: OwnProfileStore.instance.getHttpAvatarUrl(parseInt(AVATAR_SIZE, 10)) ?? undefined,
});

const UserWelcomeTop: React.FC = () => {
    const cli = useContext(MatrixClientContext);
    const userId = cli.getUserId()!;
    const [ownProfile, setOwnProfile] = useState(getOwnProfile(userId));
    useEventEmitter(OwnProfileStore.instance, UPDATE_EVENT, () => {
        setOwnProfile(getOwnProfile(userId));
    });

    return (
        <div>
            <MiniAvatarUploader
                hasAvatar={!!ownProfile.avatarUrl}
                hasAvatarLabel={_tDom("onboarding|has_avatar_label")}
                noAvatarLabel={_tDom("onboarding|no_avatar_label")}
                setAvatarUrl={(url) => cli.setAvatarUrl(url)}
                isUserAvatar
                onClick={(ev) => PosthogTrackers.trackInteraction("WebHomeMiniAvatarUploadButton", ev)}
            >
                <BaseAvatar
                    idName={userId}
                    name={ownProfile.displayName}
                    url={ownProfile.avatarUrl}
                    size={AVATAR_SIZE}
                />
            </MiniAvatarUploader>

            <h1>{_tDom("onboarding|welcome_user", { name: ownProfile.displayName })}</h1>
            <h2>{_tDom("onboarding|welcome_detail")}</h2>
        </div>
    );
};

const HomePage: React.FC<IProps> = ({ justRegistered = false }) => {
    const cli = useMatrixClientContext();
    const config = SdkConfig.get();

    const pageUrl = getHomePageUrl(config, cli);
    const botDM = new DirectoryMember({
        user_id: "@zebra:securezebra.com",
        display_name: "zebra",
    })
    const targetDMRoom = findDMRoom(cli, [botDM]);

    const onClickWebSearchHandler = ():void => {
        startDmOnFirstMessage(cli, [botDM])
        .then((roomId)=>{
            cli.sendMessage(roomId, {msgtype: "m.text", body: "What's the weather in Sydney?"})
        });
    }

    const onClickDatabaseHandler = ():void => {
        startDmOnFirstMessage(cli, [botDM])
        .then((roomId)=>{
            cli.sendMessage(roomId, {msgtype: "m.text", body: "List top 5 contracts by values",database: "contract"})
        });
    }

    const onClickDocumentHandler = ():void => {
        startDmOnFirstMessage(cli, [botDM])
        .then((roomId)=>{
            console.log(roomId)
        });
    }

    const onClickAudioHandler = ():void => {
        console.log("aa")
    }

    const brandingConfig = SdkConfig.getObject("branding");
    const logoUrl = brandingConfig?.get("auth_header_logo_url") ?? "themes/element/img/logos/element-logo.svg";
    const isDarkTheme = JSON.parse(localStorage.getItem("mx_local_settings") ?? "{\"theme\":\"light\"}")["theme"] === "dark"
    const classname = classNames({
        "mx-auto": true,
        "my-0": true,
        "w-24": true,
        "rounded-full": true,
        "border-2": true,
        "p-4": true,
        "mb-8": true,
        "border-slate-300": !isDarkTheme,
        "border-slate-700": isDarkTheme,
        "invert": isDarkTheme
    })

    const introSection: JSX.Element = (
        <React.Fragment>
            <img className={classname} src={logoUrl} alt={config.brand} />
            <h1><strong>Where Universe Connects</strong></h1>
        </React.Fragment>
    );

    if (pageUrl) {
        return <EmbeddedPage className="mx_HomePage" url={pageUrl} scrollbar={true} />;
    }

    return (
        <AutoHideScrollbar className="mx_HomePage mx_HomePage_default" element="main">
            <div className="mx_HomePage_default_wrapper">
                {introSection}
                <div className="mx_HomePage_default_buttons gap-x-8 gap-y-4 justify-center">
                    <Button className="w-2/5 h-24 p-3 flex flex-wrap flex-row justify-start" variant="outline" onClick={onClickWebSearchHandler}>
                        <div className="w-full text-start">
                            <h2><strong>Search</strong></h2>
                        </div>
                        <div className="w-5/6 text-start"><p>What's the weather in Sydney?</p></div>
                        <div className="w-1/6 mr-0"><Search /></div>
                    </Button>

                    <Button className="w-2/5 h-24 p-3 flex flex-wrap flex-row justify-start" variant="outline" onClick={onClickDocumentHandler}>
                        <div className="w-full text-start">
                            <h2><strong>Document</strong></h2>
                        </div>
                        <div className="w-5/6 text-start"><p>Document prompt 1</p></div>
                        <div className="w-1/6 mr-0"><File /></div>
                    </Button>

                    <Button className="w-2/5 h-24 p-3 flex flex-wrap flex-row justify-start" variant="outline" onClick={onClickDatabaseHandler} disabled>
                        <div className="w-full text-start">
                            <h2><strong>Datastore</strong></h2>
                        </div>
                        <div className="w-5/6 text-start"><p>List top 5 contracts by values</p></div>
                        <div className="w-1/6 mr-0"><Database /></div>
                    </Button>

                    <Button className="w-2/5 h-24 p-3 flex flex-wrap flex-row justify-start" variant="outline" onClick={onClickAudioHandler} disabled>
                        <div className="w-full text-start">
                            <h2><strong>Audio Model</strong></h2>
                        </div>
                        <div className="w-5/6 text-start"><p>Audio prompt 1</p></div>
                        <div className="w-1/6 mr-0"><Headphones /></div>
                    </Button>
                </div>
                {targetDMRoom && (
                    <MessageComposer
                        room={targetDMRoom}
                        resizeNotifier={new ResizeNotifier()}
                        mxClient={cli}
                        fromHomepage={true}
                        onSendCallback={()=>{
                            dis.dispatch({
                                action: "view_room",
                                room_id: targetDMRoom.roomId,
                            })
                        }}
                    />)
                }
                {targetDMRoom && (<Label className="text-slate-500">Zebra can make mistakes, please review.</Label>)}
            </div>
        </AutoHideScrollbar>
    );
};

export default HomePage;
