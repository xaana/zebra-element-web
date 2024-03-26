import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import { Room } from "matrix-js-sdk/src/matrix";

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
};
