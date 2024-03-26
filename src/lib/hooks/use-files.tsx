import { useCallback } from "react";
import { Direction, Filter, MatrixEvent, Room } from "matrix-js-sdk/src/matrix";
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import type { File } from "@/plugins/files/types";

export function useFiles(): { getUserFiles: () => Promise<File[]> } {
    const client = useMatrixClientContext();

    const getUserFiles = useCallback(async (): Promise<File[]> => {
        const rooms: Room[] = client.getVisibleRooms(false);

        const encryptedRooms = [];
        const plainRooms = [];
        for (const room of rooms) {
            if (client.isRoomEncrypted(room.roomId)) {
                encryptedRooms.push(room);
            } else {
                plainRooms.push(room);
            }
        }

        const plainFilter = new Filter(client.getSafeUserId());
        plainFilter.setDefinition({
            room: {
                timeline: {
                    contains_url: true,
                    types: ["m.room.message"],
                },
            },
        });

        plainFilter.filterId = await client.getOrCreateFilter(
            "FILTER_FILES_PLAIN_" + client.credentials.userId,
            plainFilter,
        );
        const plainTimelineSets = plainRooms.map((room) => room.getOrCreateFilteredTimelineSet(plainFilter));
        const plainEvents = plainTimelineSets.flatMap((ts) =>
            ts.getTimelines().flatMap(async (t) => {
                const timeline = t.fork(Direction.Forward);
                let next = true;
                while (next) {
                    await client.paginateEventTimeline(timeline, { backwards: true });
                    next = timeline.getPaginationToken(Direction.Backward) !== null;
                }
                return timeline.getEvents().filter((ev) => ev.getContent().file);
            }),
        );

        const encryptedFilter = new Filter(client.getSafeUserId());
        encryptedFilter.setDefinition({
            room: {
                timeline: {
                    types: ["m.room.encrypted"],
                },
            },
        });

        encryptedFilter.filterId = await client.getOrCreateFilter(
            "FILTER_FILES_ENCRYPTED_" + client.credentials.userId,
            encryptedFilter,
        );
        const encryptedTimelineSets = encryptedRooms.map((room) =>
            room.getOrCreateFilteredTimelineSet(encryptedFilter),
        );
        const encryptedEvents = encryptedTimelineSets.flatMap((ts) =>
            ts.getTimelines().flatMap(async (t) => {
                const timeline = t.fork(Direction.Forward);
                let next = true;
                while (next) {
                    await client.paginateEventTimeline(timeline, { backwards: true });
                    next = timeline.getPaginationToken(Direction.Backward) !== null;
                }
                return timeline.getEvents().filter((ev) => ev.getContent().file);
            }),
        );

        // Collect all event promises
        const eventsPromises = Promise.all([...plainEvents, ...encryptedEvents]);
        // Await the resolution of all event promises, then process and return the final array
        const results = await eventsPromises;
        const finalResults = results.flat();
        const roomResults = rooms
            .flatMap((r) => r.getTimelineSets().flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents())))
            .filter((ev) => ev.getContent().url || ev.getContent().file);

        const events: MatrixEvent[] = [...roomResults, ...finalResults]; // Return the combined array

        const files: File[] = events
            .map((event) => {
                const mxcUrl = event.getContent().url ?? event.getContent().file?.url;
                return {
                    id: event.getId() ?? "",
                    name: event.getContent().body,
                    downloadUrl: client.mxcUrlToHttp(mxcUrl) ?? "",
                    timestamp: new Date(event.localTimestamp),
                    roomId: event.getRoomId() ?? "",
                    room: rooms.find((r) => r.roomId === event.getRoomId()),
                    sender: event.getSender() ?? "",
                    isEncrypted: event.isEncrypted(),
                    mediaHelper: new MediaEventHelper(event),
                };
            })
            .filter((file, index, self) => index === self.findIndex((f) => f.id === file.id));

        return files;
    }, [client]);

    return { getUserFiles };
}
