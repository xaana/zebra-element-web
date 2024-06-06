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
import { useContext, useState, useRef } from "react";
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
import { Search, File, Database, Image } from "lucide-react";
import { DirectoryMember, startDmOnFirstMessage } from "matrix-react-sdk/src/utils/direct-messages";
import { MessageComposer } from "matrix-react-sdk/src/components/views/rooms/MessageComposer";
import { findDMRoom } from "matrix-react-sdk/src/utils/dm/findDMRoom";
import ResizeNotifier from "matrix-react-sdk/src/utils/ResizeNotifier";

import { Button } from "../ui/button";
import { IconTurium } from "@/components/ui/icons";
import ZebraAlert from "../ui/ZebraAlert";
import ContentMessages from "matrix-react-sdk/src/ContentMessages";

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
    });
    const targetDMRoom = findDMRoom(cli, [botDM]);

    const onClickWebSearchHandler = (): void => {
        startDmOnFirstMessage(cli, [botDM]).then((roomId) => {
            cli.sendMessage(roomId, { msgtype: "m.text", body: "What's the weather in Sydney?" });
        });
    };

    const onClickDatabaseHandler = (): void => {
        startDmOnFirstMessage(cli, [botDM]).then((roomId) => {
            cli.sendMessage(roomId, {
                msgtype: "m.text",
                body: "List top 5 contracts by values",
                database: "contract",
            });
        });
    };

    const onClickDocumentHandler = (file: File): void => {
        startDmOnFirstMessage(cli, [botDM]).then((roomId) => {
            ContentMessages.sharedInstance().sendContentToRoom(file, roomId, null, cli, null);
        });
    };

    const onClickImageHandler = (file: File): void => {
        startDmOnFirstMessage(cli, [botDM]).then((roomId) => {
            ContentMessages.sharedInstance().sendContentToRoom(file, roomId, null, cli, null);
        });
    };

    // const brandingConfig = SdkConfig.getObject("branding");
    // const logoUrl = brandingConfig?.get("auth_header_logo_url") ?? "themes/element/img/logos/element-logo.svg";
    // const isDarkTheme =
    //     JSON.parse(localStorage.getItem("mx_local_settings") ?? '{"theme":"light"}')["theme"] === "dark";
    // const logoClass = classNames(
    //     "mx-auto my-0 w-24 rounded-full border-2 p-4 mb-8",
    //     // { "border-slate-700 invert": isDarkTheme },
    //     // { "border-slate-300": !isDarkTheme },
    // );

    const BrandSection = () => (
        <div className="brand">
            <div className="w-24 rounded-full border-2 p-4 self-center">
                <IconTurium className="w-15 h-15" />
            </div>
            <h1>
                <strong>Where Universe Connects</strong>
            </h1>
        </div>
    );

    const DefaultButton = ({
        title,
        query,
        onClick,
        Icon,
    }: {
        title: string;
        query: string;
        onClick: () => void;
        Icon: JSX.Element;
    }) => (
        <Button className="h-18 default_button rounded-2xl" variant="outline" onClick={onClick}>
            <div className="w-full flex justify-between">
                <div className="text-start">
                    <p style={{ fontSize: 20, fontWeight: 100 }}>{title}</p>
                </div>
                <div className="w-1/6 mr-0">
                    <Icon />
                </div>
            </div>
            <div className="w-5/6 text-start overflow-hidden">
                <p style={{ fontSize: 16, fontWeight: 100 }}>{query}</p>
            </div>
        </Button>
    );

    const UploadButton: React.FC<{
        title: string;
        query: string;
        Icon: React.JSX.Element;
        onFinish?: (file: File | null) => void;
        accept: string;
    }> = ({ title, query, Icon, onFinish, accept }) => {
        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file && onFinish) {
                onFinish(file);
            }
            event.target.value = "";
        };
        return (
            <>
                <DefaultButton title={title} query={query} onClick={() => fileInputRef.current?.click()} Icon={Icon} />
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileInputChange}
                    accept={accept === "image" ? ".jpg, .jpeg, .png" : ".pdf, .docx, .doc, .webp"}
                />
            </>
        );
    };

    if (pageUrl) {
        return <EmbeddedPage className="mx_HomePage" url={pageUrl} scrollbar={true} />;
    }

    return (
        <AutoHideScrollbar className="mx_HomePage mx_HomePage_default justify-center" element="main">
            {/* <EditorDialog onDestroyCallback={onRTEDestroyCallback} /> */}
            <BrandSection />
            <div className="default_buttons">
                <DefaultButton
                    title="Browse"
                    query="What's the weather in Sydney?"
                    onClick={onClickWebSearchHandler}
                    Icon={Search}
                />
                <DefaultButton
                    title="Data Insights"
                    query=" List top 5 contracts by values"
                    onClick={onClickDatabaseHandler}
                    Icon={Database}
                />
                <UploadButton
                    title="Doc Insights"
                    query="Upload a file to retrieve insights"
                    onFinish={onClickDocumentHandler}
                    Icon={File}
                    accept="file"
                />
                <UploadButton
                    title="Image Insights"
                    query="Attach your image to get AI-driven analysis"
                    onFinish={onClickImageHandler}
                    Icon={Image}
                    accept="image"
                />
            </div>
            <div className="absolute w-full bottom-0">
                {targetDMRoom && (
                    <>
                        <MessageComposer
                            room={targetDMRoom}
                            resizeNotifier={new ResizeNotifier()}
                            mxClient={cli}
                            fromHomepage={true}
                            onSendCallback={() => {
                                dis.dispatch({
                                    action: "view_room",
                                    room_id: targetDMRoom.roomId,
                                });
                            }}
                        />
                        <ZebraAlert />
                    </>
                )}
            </div>
        </AutoHideScrollbar>
    );
};

export default HomePage;
