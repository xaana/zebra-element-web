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

export const MimeTypeToExtensionMapping: { [key: string]: string } = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.oasis.opendocument.text": "odt",
    "text/rtf": "rtf",
    "text/plain": "txt",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.oasis.opendocument.spreadsheet": "ods",
    // "text/csv": "csv",
    // "text/tab-separated-values": "tsv",
};
