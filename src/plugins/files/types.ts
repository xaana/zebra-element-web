import type { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import type { MsgType, MatrixEvent } from "matrix-js-sdk/src/matrix";
export type File = {
    id?: string;
    name: string;
    downloadUrl: string;
    timestamp: Date;
    sender: string;
    roomId: string | null;
    // room?: Room;
    type: MsgType | string;
    isEncrypted: boolean;
    mediaHelper?: MediaEventHelper;
    mxEvent?: MatrixEvent;
    mediaId: string;
    event?: string;
    fileSize?: number;
    mimetype?: string;
};
