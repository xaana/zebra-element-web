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
      const encryptedRooms = [];
      const plainRooms = [];
      for (let room of rooms) {
        if (client.isRoomEncrypted(room.roomId)) {
          encryptedRooms.push(room)
        } else {
          plainRooms.push(room);;
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
    
      plainFilter.filterId = await client.getOrCreateFilter("FILTER_FILES_PLAIN_" + client.credentials.userId, plainFilter);
      const plainTimelineSets = plainRooms.map((room) => room.getOrCreateFilteredTimelineSet(plainFilter));
      const plainEvents = plainTimelineSets.flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()));
    
      const encryptedFilter = new Filter(client.getSafeUserId());
      encryptedFilter.setDefinition({
        room: {
          timeline: {
            types: ["m.room.message"],
          },
        },
      });
    
      encryptedFilter.filterId = await client.getOrCreateFilter("FILTER_FILES_ENCRYPTED_" + client.credentials.userId, encryptedFilter);
      const encryptedTimelineSets = encryptedRooms.map((room) => room.getOrCreateFilteredTimelineSet(encryptedFilter));
      const encryptedEvents = encryptedTimelineSets
        .flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()))
        .filter((ev) => ev.getContent().file);

      setEvents([ ...plainEvents, ...encryptedEvents]);
    }

        initRouting();

        const newRooms = client.getVisibleRooms(false);
        setRooms(newRooms);
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
