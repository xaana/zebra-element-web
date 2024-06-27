import type { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import type { MsgType, MatrixEvent } from "matrix-js-sdk/src/matrix";
export type MatrixFile = {
    id?: string;
    name: string;
    downloadUrl: string;
    timestamp: Date;
    sender: string;
    roomId: string | null;
    // room?: Room;
    type: MsgType | string;
    isEncrypted: boolean;
    mediaId: string;
    mediaHelper?: MediaEventHelper;
    mxEvent?: MatrixEvent;
    event?: string;
    fileSize?: number;
    mimetype?: string;
};
