import { useCallback, useMemo } from "react";
import {
    Direction,
    EventTimelineSet,
    Filter,
    MatrixEvent,
    Room,
    IContextResponse,
    Method,
    IRelationsResponse,
} from "matrix-js-sdk/src/matrix";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { encodeUri } from "matrix-js-sdk/src/utils";
import { Feature, ServerSupport } from "matrix-js-sdk/src/feature";
import { getRelationsThreadFilter } from "matrix-js-sdk/src/thread-utils";
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";

import type { File } from "@/plugins/files/types";
export function useFiles(): { getUserFiles: () => Promise<File[]> } {
    const client = useMatrixClientContext();

    // Create a memoised filter to reuse if client hasn't changed
    const filter = useMemo(() => {
        const newFilter = new Filter(client.getSafeUserId());
        newFilter.setDefinition({
            room: {
                timeline: {
                    types: ["m.room.message", "m.room.encrypted"],
                },
            },
        });
        return newFilter;
    }, [client]);

    /**
     * Returns an array of events belonging to a given thread's EventTimelineSet.
     *
     * @return {Promise<MatrixEvent[]>} Array of unique files from events in the rooms
     */
    const getThreadEvents = useCallback(
        async (timelineSet: EventTimelineSet, eventId: string): Promise<MatrixEvent[]> => {
            const path = encodeUri("/rooms/$roomId/context/$eventId", {
                $roomId: timelineSet.room?.roomId,
                $eventId: eventId,
            });

            const params: Record<string, string | string[]> = {
                limit: "0",
            };

            const res = await client.http.authedRequest<IContextResponse>(Method.Get, path, params);
            const mapper = client.getEventMapper();

            const recurse = client.canSupport.get(Feature.RelationsRecursion) !== ServerSupport.Unsupported;

            if (!timelineSet.thread) {
                throw new Error("could not get thread timeline: not a thread timeline");
            }

            const thread = timelineSet.thread;
            const resOlder: IRelationsResponse = await client.fetchRelations(
                timelineSet.room!.roomId,
                thread.id,
                null,
                null,
                {
                    dir: Direction.Backward,
                    from: res.start,
                    recurse: recurse || undefined,
                },
            );
            const resNewer: IRelationsResponse = await client.fetchRelations(
                timelineSet.room!.roomId,
                thread.id,
                null,
                null,
                {
                    dir: Direction.Forward,
                    from: res.end,
                    recurse: recurse || undefined,
                },
            );

            const events = [
                ...resNewer.chunk.reverse().filter(getRelationsThreadFilter(thread.id)).map(mapper),
                ...resOlder.chunk.filter(getRelationsThreadFilter(thread.id)).map(mapper),
            ];

            return events;
        },
        [client],
    );

    /**
     * Returns an array of files fetched from encrypted and plain rooms.
     *
     * @return {Promise<File[]>} Array of unique files from events in the rooms
     */
    const getUserFiles = useCallback(async (): Promise<File[]> => {
        // Fetch all rooms current user is a part of
        const rooms: Room[] = client.getVisibleRooms(false);

        // Array to store all `m.file` events across all rooms
        const allFileEvents: MatrixEvent[] = [];

        // Array to store all thread root events across all rooms
        const threadRootEvents: MatrixEvent[] = [];

        // Fetch all file events in main room timelines
        try {
            filter.filterId = await client.getOrCreateFilter("FILTER_FILES_" + client.credentials.userId, filter);

            await Promise.all(
                rooms.map(async (roomData) => {
                    const room = client.getRoom(roomData.roomId);
                    if (!room) return;

                    const timelineSet = room.getOrCreateFilteredTimelineSet(filter);
                    const roomEvents = timelineSet.getLiveTimeline().getEvents();
                    await Promise.all(roomEvents.map((event) => client.decryptEventIfNeeded(event)));
                    roomEvents.forEach((event) => {
                        // Store thread root events
                        event.isThreadRoot && threadRootEvents.push(event);
                        // Store `m.file` type events
                        (event.getContent().url || event.getContent().file) && allFileEvents.push(event);
                    });
                }),
            );
        } catch (error) {
            console.error("Failed to fetch events in main room timelines:", error);
        }

        // Fetch all file events in thread root events
        try {
            const threadEventsPromises = threadRootEvents.map((event) =>
                getThreadEvents(event.getThread()!.timelineSet, event.getId()!),
            );
            const threadEvents = (await Promise.all(threadEventsPromises)).flat();
            await Promise.all(threadEvents.map((event) => client.decryptEventIfNeeded(event)));
            allFileEvents.push(...threadEvents.filter((event) => event.getContent().url || event.getContent().file));
        } catch (error) {
            console.error("Failed to fetch events in thread timelines:", error);
        }

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
    }, [client, filter, getThreadEvents]);

    return { getUserFiles };
}
