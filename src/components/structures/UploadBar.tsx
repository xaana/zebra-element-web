import React from "react";
import { Room, IEventRelation } from "matrix-js-sdk/src/matrix";
import { Optional } from "matrix-events-sdk";
import ContentMessages from "matrix-react-sdk/src/ContentMessages";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { _t } from "matrix-react-sdk/src/languageHandler";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import ProgressBar from "matrix-react-sdk/src/components/views/elements/ProgressBar";
import AccessibleButton, { ButtonEvent } from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import { RoomUpload } from "matrix-react-sdk/src/models/RoomUpload";
import { ActionPayload } from "matrix-react-sdk/src/dispatcher/payloads";
import { UploadPayload } from "matrix-react-sdk/src/dispatcher/payloads/UploadPayload";
import { fileSize } from "matrix-react-sdk/src/utils/FileUtils";

interface IProps {
    room: Room;
    relation?: IEventRelation;
}

interface IState {
    currentFile?: string;
    currentUpload?: RoomUpload;
    currentLoaded?: number;
    currentTotal?: number;
    countFiles: number;
}

function isUploadPayload(payload: ActionPayload): payload is UploadPayload {
    return [
        Action.UploadStarted,
        Action.UploadProgress,
        Action.UploadFailed,
        Action.UploadFinished,
        Action.UploadCanceled,
    ].includes(payload.action as Action);
}

export default class UploadBar extends React.PureComponent<IProps, IState> {
    private dispatcherRef: Optional<string>;
    private mounted = false;

    public constructor(props: IProps) {
        super(props);

        // Set initial state to any available upload in this room - we might be mounting
        // earlier than the first progress event, so should show something relevant.
        this.state = this.calculateState();
    }

    public componentDidMount(): void {
        this.dispatcherRef = dis.register(this.onAction);
        this.mounted = true;
    }

    public componentWillUnmount(): void {
        this.mounted = false;
        dis.unregister(this.dispatcherRef!);
    }

    private getUploadsInRoom(): RoomUpload[] {
        const uploads = ContentMessages.sharedInstance().getCurrentUploads(this.props.relation);
        return uploads.filter((u) => u.roomId === this.props.room.roomId);
    }

    private calculateState(payload?: ActionPayload): IState {
        if(payload&&payload.progress) {
            
            const [currentUpload, ...otherUploads] = this.getUploadsInRoom();
            if(payload.progress.loaded === payload.progress.total) {
                return {
                    currentUpload,
                    currentFile: currentUpload?.fileName,
                    currentLoaded: currentUpload?.loaded,
                    currentTotal: currentUpload?.total,
                    countFiles: otherUploads.length,
                }
            }
            return {
                currentUpload:payload.upload,
                currentFile: payload.upload.fileName,
                currentLoaded: payload.progress.loaded,
                currentTotal: payload.progress.total,
                countFiles: otherUploads.length + 1,
            }
        }
        const [currentUpload, ...otherUploads] = this.getUploadsInRoom();
        return {
            currentUpload,
            currentFile: currentUpload?.fileName,
            currentLoaded: currentUpload?.loaded,
            currentTotal: currentUpload?.total,
            countFiles: otherUploads.length + 1,
        };
    }

    private onAction = (payload: ActionPayload): void => {
        if (!this.mounted) return;
        if (isUploadPayload(payload)) {
            this.setState(this.calculateState(payload));
        }
    };

    private onCancelClick = (ev: ButtonEvent): void => {
        ev.preventDefault();
        ContentMessages.sharedInstance().cancelUpload(this.state.currentUpload!);
    };

    public render(): React.ReactNode {
        if (!this.state.currentFile) {
            return null;
        }

        const uploadText: string = "Uploading";
        // if (this.state.countFiles > 1) {
        //     // MUST use var name 'count' for pluralization to kick in
        //     uploadText = _t("room|upload|uploading_multiple_file", {
        //         filename: this.state.currentFile,
        //         count: this.state.countFiles - 1,
        //     });
        // } else {
        //     uploadText = _t("room|upload|uploading_single_file", {
        //         filename: this.state.currentFile,
        //     });
        // }

        // const uploadSize = fileSize(this.state.currentTotal!);
        return (
            <div className="mx_UploadBar">
                <div className="mx_UploadBar_filename">
                    {uploadText} 
                    {/* ({uploadSize}) */}
                </div>
                <AccessibleButton onClick={this.onCancelClick} className="mx_UploadBar_cancel" />
                <ProgressBar value={this.state.currentLoaded!} max={this.state.currentTotal!} />
            </div>
        );
    }
}
