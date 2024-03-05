import React, { useEffect, useState } from "react";
import { Filter, MatrixClient, MatrixEvent, Room } from "matrix-js-sdk/src/matrix";
import DMRoomMap from "matrix-react-sdk/src/utils/DMRoomMap";
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { columns, DataTable, File } from "./DataTable";
import { init as initRouting } from "../../vector/routing";

const isDirectMessageRoom = (client: MatrixClient, room: Room) => {
    let dmRoomMap = DMRoomMap.shared();
    if (!dmRoomMap) {
        dmRoomMap = DMRoomMap.makeShared(client);
        dmRoomMap.start();
    }

    const dmRoomIds = dmRoomMap.getRoomIds();
    return dmRoomIds.has(room.roomId);
};

export const MainPanel = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [events, setEvents] = useState<MatrixEvent[]>([]);
    const client = useMatrixClientContext();

    useEffect(() => {
        const fetchFileEventsServer = async (rooms: Room[]) => {
            const dmRooms = [];
            const commonRooms = [];
            for (const room of rooms) {
                if (isDirectMessageRoom(client, room)) {
                    dmRooms.push(room);
                } else {
                    commonRooms.push(room);
                }
            }

            const dmFilter = new Filter(client.getSafeUserId());
            dmFilter.setDefinition({
                room: {
                    timeline: {
                        contains_url: true,
                        types: ["m.room.message"],
                    },
                },
            });

            dmFilter.filterId = await client.getOrCreateFilter(
                "FILTER_FILES_PLAIN_" + client.credentials.userId,
                dmFilter,
            );
            const dmTimelineSets = dmRooms.map((room) => room.getOrCreateFilteredTimelineSet(dmFilter));
            const dmEvents = dmTimelineSets.flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()));

            console.log("dmTimelineSets", dmTimelineSets);
            console.log("dmEvents", dmEvents);

            const commonFilter = new Filter(client.getSafeUserId());
            commonFilter.setDefinition({
                room: {
                    timeline: {
                        types: ["m.room.message"],
                    },
                },
            });

            commonFilter.filterId = await client.getOrCreateFilter(
                "FILTER_FILES_ENCRYPTED_" + client.credentials.userId,
                commonFilter,
            );
            const commonTimelineSets = commonRooms.map((room) => room.getOrCreateFilteredTimelineSet(commonFilter));
            const commonEvents = commonTimelineSets
                .flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()))
                .filter((ev) => ev.getContent().file);

            console.log("commonTimelineSets", commonTimelineSets);
            console.log("commonEvents", commonEvents);

            setEvents([...dmEvents, ...commonEvents]);
        };

        initRouting();

        const newRooms = client.getVisibleRooms(false);
        setRooms(newRooms);

        console.log("newRooms", newRooms);

        fetchFileEventsServer(newRooms);
    }, [client]);

    const files: File[] = events.map((event) => {
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
    });

    console.log("Files", files);

    return (
        <div>
            <DataTable columns={columns} data={files} />
        </div>
    );
};
