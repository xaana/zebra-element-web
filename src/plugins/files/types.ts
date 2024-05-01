import type { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import type { Room, MsgType, MatrixEvent } from "matrix-js-sdk/src/matrix";
export type File = {
    id: string;
    name: string;
    downloadUrl: string;
    timestamp: Date;
    sender: string;
    roomId: string;
    room?: Room;
    isEncrypted: boolean;
    mediaHelper: MediaEventHelper;
    mediaId: string;
    type: MsgType | string;
    mxEvent?: MatrixEvent;
};
