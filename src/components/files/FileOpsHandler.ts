import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import type { MatrixFile as File } from "@/plugins/files/types";

export type FileDTO = {
    mediaId: string;
    eventId?: string;
    roomId?: string;
    userIds: string | string[];
    senderId?: string;
    filename: string;
    filetype?: string;
    size: number;
    timestamp: Date;
};

export const listFiles = async (
    userId: string,
    type?: string,
    uploadService?: string,
    url: string = SettingsStore.getValue("reportsApiUrl"),
): Promise<FileDTO[]> => {
    try {
        const response = await fetch(url + "/api/files/get_info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userId,
                media_type: type,
                upload_service: uploadService,
            }),
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();

        const result = data.map((item) => ({
            mediaId: item.session_id,
            eventId: item.event_id ?? null,
            roomId: item.room_id,
            userIds: item.user_ids,
            senderId: item.sender_id,
            filename: item.filename,
            filetype: item.mime_type,
            size: typeof item.size === "string" ? parseFloat(item.metadata.size) : item.metadata.size,
            timestamp: new Date(item.metadata.timestamp),
        }));

        return result.reverse();
    } catch (error) {
        console.error("Failed to list files:", error);  // Logging the error for debugging purposes
        return [];  // Returning null or you could throw an error instead
    }
};


export const getFile = async (
    mediaIds: string | string[],
    userId: string,
    url: string = SettingsStore.getValue("reportsApiUrl"),
): Promise<Blob> => {
    return (
        fetch(url + "/api/files/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                media_id: mediaIds,
                user_id: userId,
            }),
        })
            // .then(res=>res.blob())
            .then((res) => res.json())
            .then((res) => {
                const decodedData = atob(res.file);
                const byteNumbers = new Array(decodedData.length);
                for (let i = 0; i < decodedData.length; i++) {
                    byteNumbers[i] = decodedData.charCodeAt(i);
                }
                return new Uint8Array(byteNumbers);
            })
    );
};

export const uploadFile = async (
    filename: string,
    mediaId: string,
    type: string,
    userIds: string | string[],
    eventId?: string,
    roomId?: string,
    senderId?: string,
    url: string = SettingsStore.getValue("reportsApiUrl"),
): Promise<Object> => {
    return fetch(url + "/api/files/upload_info", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            filename: filename,
            media_id: mediaId,
            media_type: type,
            user_ids: userIds,
            event_id: eventId,
            room_id: roomId,
            sender_id: senderId,
        }),
    }).then((res) => res.json());
};

export const deleteFiles = async (
    mediaId: string,
    userId: string,
    url: string = SettingsStore.getValue("reportsApiUrl"),
): Promise<Object> => {
    return fetch(url + "/api/files/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            media_id: mediaId,
            user_id: userId,
        }),
    }).then((res) => res.json());
};

export const navigateToRoom = (room: string): void => {};

export const dtoToFileAdapters = (
    dto: FileDTO,
    defaultSenderId: string | null,
    synapseUrl: string = "http://synapse:8008",
): File => {
    const uri = synapseUrl + `/_matrix/media/v3/download/securezebra.com/${dto.mediaId}`;
    return {
        id: dto.mediaId,
        name: dto.filename,
        downloadUrl: uri,
        timestamp: dto.timestamp,
        sender: dto.senderId ?? defaultSenderId ?? "null",
        roomId: dto.roomId ?? null,
        isEncrypted: false,
        mediaId: dto.mediaId,
        type: "m.file",
        fileSize: dto.size,
        mimetype: dto.filetype,
        event: dto.eventId,
    };
};
