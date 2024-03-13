/*
Copyright 2022 The Matrix.org Foundation C.I.C.

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

import classNames from "classnames";
import { IEventRelation, Room, MatrixClient, THREAD_RELATION_TYPE, M_POLL_START } from "matrix-js-sdk/src/matrix";
import React, { createContext, ReactElement, ReactNode, useContext, useRef } from "react";
import { _t } from "matrix-react-sdk/src/languageHandler";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";
import { CollapsibleButton } from "matrix-react-sdk/src/components/views/rooms/CollapsibleButton";
import { MenuProps } from "matrix-react-sdk/src/components/structures/ContextMenu";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import ErrorDialog from "matrix-react-sdk/src/components/views/dialogs/ErrorDialog";
import LocationButton from "matrix-react-sdk/src/components/views/location/LocationButton";
import Modal from "matrix-react-sdk/src/Modal";
import PollCreateDialog from "matrix-react-sdk/src/components/views/elements/PollCreateDialog";
import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import ContentMessages from "matrix-react-sdk/src/ContentMessages";
import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import { useDispatcher } from "matrix-react-sdk/src/hooks/useDispatcher";
import { chromeFileInputFix } from "matrix-react-sdk/src/utils/BrowserWorkarounds";
import IconizedContextMenu, {
    IconizedContextMenuOptionList,
} from "matrix-react-sdk/src/components/views/context_menus/IconizedContextMenu";
import { EmojiButton } from "matrix-react-sdk/src/components/views/rooms/EmojiButton";
import { filterBoolean } from "matrix-react-sdk/src/utils/arrays";
import { useSettingValue } from "matrix-react-sdk/src/hooks/useSettings";
import { ButtonEvent } from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import { ComposerInsertPayload } from "matrix-react-sdk/src/dispatcher/payloads/ComposerInsertPayload";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";

import { AudioCapture } from "./audio-capture";
import { VoiceBotButton } from "./voiceBot/VoiceBotButton";

interface IProps {
    addEmoji: (emoji: string) => boolean;
    haveRecording: boolean;
    isMenuOpen: boolean;
    isStickerPickerOpen: boolean;
    menuPosition?: MenuProps;
    onRecordStartEndClick: () => void;
    relation?: IEventRelation;
    setStickerPickerOpen: (isStickerPickerOpen: boolean) => void;
    showLocationButton: boolean;
    showPollsButton: boolean;
    showStickersButton: boolean;
    toggleButtonMenu: () => void;
    showVoiceBroadcastButton: boolean;
    onStartVoiceBroadcastClick: () => void;
    isRichTextEnabled: boolean;
    onComposerModeClick: () => void;
}

type OverflowMenuCloser = () => void;
export const OverflowMenuContext = createContext<OverflowMenuCloser | null>(null);

const MessageComposerButtons: React.FC<IProps> = (props: IProps) => {
    const matrixClient = useContext(MatrixClientContext);
        const { room, narrow } = useContext(RoomContext);
    const context = useContext(RoomContext);

    const isWysiwygLabEnabled = useSettingValue<boolean>("feature_wysiwyg_composer");

    if (!matrixClient || !room || props.haveRecording) {
        return null;
    }

    let mainButtons: ReactNode[];
    let moreButtons: ReactNode[];
    if (narrow) {
        mainButtons = [
            isWysiwygLabEnabled ? (
                <ComposerModeButton
                    key="composerModeButton"
                    isRichTextEnabled={props.isRichTextEnabled}
                    onClick={props.onComposerModeClick}
                />
            ) : (
                (emojiButton(props), voiceBotButton(matrixClient,room))
            ),
        ];
        moreButtons = [
            uploadButton(), // props passed via UploadButtonContext
            showStickersButton(props),
            voiceRecordingButton(props, narrow),
            startVoiceBroadcastButton(props),
            props.showPollsButton ? pollButton(room, props.relation) : null,
            showLocationButton(props, room, matrixClient),
        ];
    } else {
        mainButtons = [
            isWysiwygLabEnabled ? (
                <ComposerModeButton
                    key="composerModeButton"
                    isRichTextEnabled={props.isRichTextEnabled}
                    onClick={props.onComposerModeClick}
                />
            ) : (
                emojiButton(props)
            ),
            uploadButton(), // props passed via UploadButtonContext
            audioCaptureButton(),
            voiceBotButton(matrixClient,room),
        ];
        moreButtons = [
            showStickersButton(props),
            voiceRecordingButton(props, narrow),
            startVoiceBroadcastButton(props),
            props.showPollsButton ? pollButton(room, props.relation) : null,
            showLocationButton(props, room, matrixClient),
        ];
    }
    function audioCaptureButton(): ReactElement {
        return (
            <AudioCapture
                key="controls_audiocapture"
                onCapture={(text) => {
                    dis.dispatch<ComposerInsertPayload>({
                        action: Action.ComposerInsert,
                        text: text,
                        timelineRenderingType: context.timelineRenderingType,
                    });
                }}
            />
        );
    }
    mainButtons = filterBoolean(mainButtons);
    moreButtons = filterBoolean(moreButtons);

    const moreOptionsClasses = classNames({
        mx_MessageComposer_button: true,
        mx_MessageComposer_buttonMenu: true,
        mx_MessageComposer_closeButtonMenu: props.isMenuOpen,
    });

    return (
        <UploadButtonContextProvider roomId={room.roomId} relation={props.relation}>
            {mainButtons}
            {moreButtons.length > 0 && (
                <AccessibleTooltipButton
                    className={moreOptionsClasses}
                    onClick={props.toggleButtonMenu}
                    title={_t("quick_settings|sidebar_settings")}
                />
            )}
            {props.isMenuOpen && (
                <IconizedContextMenu
                    onFinished={props.toggleButtonMenu}
                    {...props.menuPosition}
                    wrapperClassName="mx_MessageComposer_Menu"
                    compact={true}
                >
                    <OverflowMenuContext.Provider value={props.toggleButtonMenu}>
                        <IconizedContextMenuOptionList>{moreButtons}</IconizedContextMenuOptionList>
                    </OverflowMenuContext.Provider>
                </IconizedContextMenu>
            )}
        </UploadButtonContextProvider>
    );
};

function emojiButton(props: IProps): ReactElement {
    return (
        <EmojiButton
            key="emoji_button"
            addEmoji={props.addEmoji}
            menuPosition={props.menuPosition}
            className="mx_MessageComposer_button"
        />
    );
}

function uploadButton(): ReactElement {
    return <UploadButton key="controls_upload" />;
}

function voiceBotButton(matrixClient: MatrixClient,room: Room): ReactElement {
    return <VoiceBotButton key="controls_voicebot" client={matrixClient} room={room.roomId} />;
}

type UploadButtonFn = () => void;
export const UploadButtonContext = createContext<UploadButtonFn | null>(null);

interface IUploadButtonProps {
    roomId: string;
    relation?: IEventRelation;
    children: ReactNode;
}

// We put the file input outside the UploadButton component so that it doesn't get killed when the context menu closes.
const UploadButtonContextProvider: React.FC<IUploadButtonProps> = ({ roomId, relation, children }) => {
    const cli = useContext(MatrixClientContext);
    const roomContext = useContext(RoomContext);
    const uploadInput = useRef<HTMLInputElement>(null);

    const onUploadClick = (): void => {
        if (cli?.isGuest()) {
            dis.dispatch({ action: "require_registration" });
            return;
        }
        uploadInput.current?.click();
    };

    useDispatcher(dis, (payload) => {
        if (roomContext.timelineRenderingType === payload.context && payload.action === "upload_file") {
            onUploadClick();
        }
    });

    const onUploadFileInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
        if (ev.target.files?.length === 0) return;

        // Take a copy, so we can safely reset the value of the form control
        ContentMessages.sharedInstance().sendContentListToRoom(
            Array.from(ev.target.files!),
            roomId,
            relation,
            cli,
            roomContext.timelineRenderingType,
        );

        // This is the onChange handler for a file form control, but we're
        // not keeping any state, so reset the value of the form control
        // to empty.
        // NB. we need to set 'value': the 'files' property is immutable.
        ev.target.value = "";
    };

    const uploadInputStyle = { display: "none" };
    return (
        <UploadButtonContext.Provider value={onUploadClick}>
            {children}

            <input
                ref={uploadInput}
                type="file"
                style={uploadInputStyle}
                multiple
                onClick={chromeFileInputFix}
                onChange={onUploadFileInputChange}
            />
        </UploadButtonContext.Provider>
    );
};

// Must be rendered within an UploadButtonContextProvider
const UploadButton: React.FC = () => {
    const overflowMenuCloser = useContext(OverflowMenuContext);
    const uploadButtonFn = useContext(UploadButtonContext);

    const onClick = (): void => {
        uploadButtonFn?.();
        overflowMenuCloser?.(); // close overflow menu
    };

    return (
        <CollapsibleButton
            className="mx_MessageComposer_button"
            iconClassName="mx_MessageComposer_upload"
            onClick={onClick}
            title={_t("common|attachment")}
        />
    );
};

function showStickersButton(props: IProps): ReactElement | null {
    return props.showStickersButton ? (
        <CollapsibleButton
            id="stickersButton"
            key="controls_stickers"
            className="mx_MessageComposer_button"
            iconClassName="mx_MessageComposer_stickers"
            onClick={() => props.setStickerPickerOpen(!props.isStickerPickerOpen)}
            title={props.isStickerPickerOpen ? _t("composer|close_sticker_picker") : _t("common|sticker")}
        />
    ) : null;
}

const startVoiceBroadcastButton: React.FC<IProps> = (props: IProps): ReactElement | null => {
    return props.showVoiceBroadcastButton ? (
        <CollapsibleButton
            key="start_voice_broadcast"
            className="mx_MessageComposer_button"
            iconClassName="mx_MessageComposer_voiceBroadcast"
            onClick={props.onStartVoiceBroadcastClick}
            title={_t("voice_broadcast|action")}
        />
    ) : null;
};

function voiceRecordingButton(props: IProps, narrow: boolean): ReactElement | null {
    // XXX: recording UI does not work well in narrow mode, so hide for now
    return narrow ? null : (
        <CollapsibleButton
            key="voice_message_send"
            className="mx_MessageComposer_button"
            iconClassName="mx_MessageComposer_voiceMessage"
            onClick={props.onRecordStartEndClick}
            title={_t("composer|voice_message_button")}
        />
    );
}

function pollButton(room: Room, relation?: IEventRelation): ReactElement {
    return <PollButton key="polls" room={room} relation={relation} />;
}

interface IPollButtonProps {
    room: Room;
    relation?: IEventRelation;
}

class PollButton extends React.PureComponent<IPollButtonProps> {
    public static contextType = OverflowMenuContext;
    public context!: React.ContextType<typeof OverflowMenuContext>;

    private onCreateClick = (): void => {
        this.context?.(); // close overflow menu
        const canSend = this.props.room.currentState.maySendEvent(
            M_POLL_START.name,
            MatrixClientPeg.safeGet().getSafeUserId(),
        );
        if (!canSend) {
            Modal.createDialog(ErrorDialog, {
                title: _t("composer|poll_button_no_perms_title"),
                description: _t("composer|poll_button_no_perms_description"),
            });
        } else {
            const threadId =
                this.props.relation?.rel_type === THREAD_RELATION_TYPE.name ? this.props.relation.event_id : undefined;

            Modal.createDialog(
                PollCreateDialog,
                {
                    room: this.props.room,
                    threadId,
                },
                "mx_CompoundDialog",
                false, // isPriorityModal
                true, // isStaticModal
            );
        }
    };

    public render(): React.ReactNode {
        // do not allow sending polls within threads at this time
        if (this.props.relation?.rel_type === THREAD_RELATION_TYPE.name) return null;

        return (
            <CollapsibleButton
                className="mx_MessageComposer_button"
                iconClassName="mx_MessageComposer_poll"
                onClick={this.onCreateClick}
                title={_t("composer|poll_button")}
            />
        );
    }
}

function showLocationButton(props: IProps, room: Room, matrixClient: MatrixClient): ReactElement | null {
    const sender = room.getMember(matrixClient.getSafeUserId());

    return props.showLocationButton && sender ? (
        <LocationButton
            key="location"
            roomId={room.roomId}
            relation={props.relation}
            sender={sender}
            menuPosition={props.menuPosition}
        />
    ) : null;
}

interface WysiwygToggleButtonProps {
    isRichTextEnabled: boolean;
    onClick: (ev: ButtonEvent) => void;
}

function ComposerModeButton({ isRichTextEnabled, onClick }: WysiwygToggleButtonProps): JSX.Element {
    const title = isRichTextEnabled ? _t("composer|mode_plain") : _t("composer|mode_rich_text");

    return (
        <CollapsibleButton
            className="mx_MessageComposer_button"
            iconClassName={classNames({
                mx_MessageComposer_plain_text: !isRichTextEnabled,
                mx_MessageComposer_rich_text: isRichTextEnabled,
            })}
            onClick={onClick}
            title={title}
        />
    );
}

export default MessageComposerButtons;
