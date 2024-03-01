import React, { useEffect, useState } from "react";

import RoomListStore from 'matrix-react-sdk/src/stores/room-list/RoomListStore';
import SpaceStore from 'matrix-react-sdk/src/stores/spaces/SpaceStore';
import { Filter, MatrixClient, MatrixEvent, Room } from 'matrix-js-sdk/src/matrix';
import { columns, DataTable, File } from './DataTable';
import DMRoomMap from 'matrix-react-sdk/src/utils/DMRoomMap';
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import { useMatrixClientContext } from 'matrix-react-sdk/src/contexts/MatrixClientContext';
import { init as initRouting } from '../../vector/routing';

const isDirectMessageRoom = (client: MatrixClient, room: Room) => {
  let dmRoomMap = DMRoomMap.shared();
  if (!dmRoomMap) {
    dmRoomMap = DMRoomMap.makeShared(client);
    dmRoomMap.start();
  }

  const dmRoomIds = dmRoomMap.getRoomIds();
  return dmRoomIds.has(room.roomId)
}

export const MainPanel = () => {
  const [rooms, setRooms] = useState<Room[]>([]); 
  const [events, setEvents] = useState<MatrixEvent[]>([]);
  const client = useMatrixClientContext();

  useEffect(() => {
    const fetchFileEventsServer = async (rooms: Room[]) => {
      const dmRooms = [];
      const commonRooms = [];
      for (let room of rooms) {
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
    
      dmFilter.filterId = await client.getOrCreateFilter("FILTER_FILES_PLAIN_" + client.credentials.userId, dmFilter);
      const dmTimelineSets = dmRooms.map((room) => room.getOrCreateFilteredTimelineSet(dmFilter));
      const dmEvents = dmTimelineSets.flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()));
    
      const commonFilter = new Filter(client.getSafeUserId());
      commonFilter.setDefinition({
        room: {
          timeline: {
            types: ["m.room.message"],
          },
        },
      });
    
      commonFilter.filterId = await client.getOrCreateFilter("FILTER_FILES_ENCRYPTED_" + client.credentials.userId, commonFilter);
      const commonTimelineSets = commonRooms.map((room) => room.getOrCreateFilteredTimelineSet(commonFilter));
      const commonEvents = commonTimelineSets.flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()));

      setEvents([ ...dmEvents, ...commonEvents]);
    }

    initRouting();

    
    const spaces = SpaceStore.instance.spacePanelSpaces;
    const invited = SpaceStore.instance.invitedSpaces;
    const lists = RoomListStore.instance.orderedLists;
    const newRooms = [ ...spaces, ...invited, ...(Object.values(lists).flat())];
    setRooms(newRooms);

    fetchFileEventsServer(newRooms);
  }, []);

  console.log({ rooms });

  const files: File[] = events.map((event) => {
    const mxcUrl = event.getContent().url?? event.getContent().file?.url;
    return {
      id: event.getId()?? '',
      name: event.getContent().body,
      downloadUrl: client.mxcUrlToHttp(mxcUrl)?? '',
      timestamp: new Date(event.localTimestamp),
      roomId: event.getRoomId()?? '',
      room: rooms.find((r) => r.roomId === event.getRoomId()),
      sender: event.getSender()?? '',
      isEncrypted: event.isEncrypted(),
      mediaHelper: new MediaEventHelper(event),
    }
  });

  return (
    <div>
      <DataTable columns={columns} data={files} />
    </div>
  );
}