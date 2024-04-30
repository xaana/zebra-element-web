import { useCallback } from "react";
import pLimit from "p-limit";
import { MatrixEvent, Room, Method } from "matrix-js-sdk/src/matrix";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { encodeUri } from "matrix-js-sdk/src/utils";
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import { IRoomEvent } from "matrix-js-sdk/src/matrix";

import type { File } from "@/plugins/files/types";

interface IMessagesResponse {
    start?: string;
    end?: string;
    chunk: IRoomEvent[];
}

export function useFiles(): { getUserFiles: () => Promise<File[]> } {
    const client = useMatrixClientContext();

    /**
     * Returns an array of files fetched from all rooms the user is a part of.
     *
     * @return {Promise<File[]>} Array of unique files from events in the rooms
     */
    const getUserFiles = useCallback(async (): Promise<File[]> => {
        // Fetch all rooms current user is a part of
        const rooms: Room[] = client.getVisibleRooms(false);

        // Array to store all file events across all rooms
        const allFileEvents: MatrixEvent[] = [];

        // Limit for concurrent requests
        const limit = pLimit(10);

        // Function to fetch all events in a room in a paginated manner
        const fetchRoomMessages = async (room: Room): Promise<IRoomEvent[]> => {
            let hasMore = true;
            let nextToken = null; // Initial nextToken is null indicating the first page
            const allRoomEvents = [];

            while (hasMore) {
                try {
                    const path = encodeUri("/rooms/$roomId/messages", {
                        $roomId: room.roomId,
                    });
                    const params: Record<string, any> = {
                        limit: 100,
                        filter: JSON.stringify({ types: ["m.room.encrypted", "m.room.message"] }),
                    };
                    if (nextToken) {
                        params.from = nextToken; // Include the nextToken for pagination
                        params.dir = "f";
                    }

                    const response = await client.http.authedRequest<IMessagesResponse>(Method.Get, path, params);
                    if (response.chunk.length === 0 || !response.end) {
                        hasMore = false; // no more data is available
                    } else {
                        nextToken = response.end; // Update the token for the next iteration
                    }
                    allRoomEvents.push(...response.chunk);
                } catch (error) {
                    console.error(`Failed to fetch event context for room ${room.roomId}:`, error);
                    break; // Break the loop on error
                }
            }

            return allRoomEvents;
        };

        // Fetch all events in all rooms
        const roomMessagesPromises = rooms.map((room) => limit(() => fetchRoomMessages(room)));

        // Map IRoomEvents to MatrixEvents
        const mapper = client.getEventMapper();

        // Consolidate all events
        const allEvents: MatrixEvent[] = (await Promise.all(roomMessagesPromises)).flat().map(mapper);

        // Decrypt all events
        await Promise.all(allEvents.map((event) => client.decryptEventIfNeeded(event)));

        // Filter out non-file events
        allFileEvents.push(
            ...allEvents.filter((event) => {
                const content = event.getContent();
                return content.url || content.file;
            }),
        );

        const files = Array.from(
            new Map(
                allFileEvents.map((event) => [
                    event.getId(),
                    {
                        id: event.getId() ?? "",
                        name: event.getContent().body ?? event.getClearContent()?.body,
                        downloadUrl: client.mxcUrlToHttp(event.getContent().url ?? event.getContent().file?.url) ?? "",
                        timestamp: new Date(event.localTimestamp),
                        roomId: event.getRoomId() ?? "",
                        room: rooms.find((r) => r.roomId === event.getRoomId()),
                        sender: event.getSender() ?? "",
                        isEncrypted: event.isEncrypted(),
                        mediaHelper: new MediaEventHelper(event),
                        mediaId: event.getContent().url ?? event.getContent().file?.url,
                    },
                ]),
            ).values(),
        );

        return files;
    }, [client]);

    return { getUserFiles };
}
