import React, { useContext, useEffect, useState } from "react"
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { Direction, Filter, MatrixEvent, Room } from "matrix-js-sdk/src/matrix";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { init as initRouting } from "../../../vector/routing";
// import { IconCheckBold } from "../../ui/icons"

import "./style/button.css"
import { IconCheckBold } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useFiles } from "@/lib/hooks/use-files";

interface IProps {
    roomId: string;
}

export interface DocFile{
    mediaId: string;
    fileName: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const FileSelector = (props:IProps) => {
    // const [events, setEvents] = useState<MatrixEvent[]>([]);
    const [files, setFiles] = useState<DocFile[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<DocFile[]>([]);
    const { timelineRenderingType } = useContext(RoomContext);
    const [spacePopoverOpen, setSpacePopoverOpen] = useState(false)
    const { getUserFiles } = useFiles();
    const client = useMatrixClientContext();
    useEffect(() => {
        initRouting();
    }, [client]);
    const onClick = () => {
        // setFiles([])
        // const currentRoom = client.getRoom(props.roomId)
        fetchFiles();
        dis.dispatch({
            action: "select_files",
            database: [],
            roomId: props.roomId,
            timelineRenderingType,
        });
    }
    const fetchFiles = async (): Promise<void> => {
        const fetchedFiles = await getUserFiles();
        const temp = fetchedFiles.map((file)=>{return {eventId:file.id,mediaId:file.mediaId,fileName:file.name,roomId:file.roomId}});
        const uniqueList =temp.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.mediaId === item.mediaId && t.fileName === item.fileName
        ))
    );
        setFiles([...uniqueList].reverse());
    };

    // useEffect(() => {
    //     if (events.length === 0) return;
    //     const files: DocFile[] = events
    //     .map((event) => {
    //         const mxcUrl = event.getContent().url ?? event.getContent().file?.url;
    //         // const urlSplit = mxcUrl?.split("/");
    //         // const mediaId = urlSplit&&urlSplit[urlSplit.length - 1];
    //         const fileName = event.getContent().body;
    //         return {
    //             mediaId: mxcUrl,
    //             fileName:fileName
                
    //         };
    //     })
    //     const uniqueList =files.filter((item, index, self) =>
    //     index === self.findIndex((t) => (
    //         t.mediaId === item.mediaId && t.fileName === item.fileName
    //     ))
    // );
    //     setFiles(uniqueList);
    // }, [events]);

    useEffect(() => {
        if(!spacePopoverOpen){
            if (selectedFiles.length > 0) {

                dis.dispatch({
                    action: "select_files",
                    files: selectedFiles,
                    roomId: props.roomId,
                    context: timelineRenderingType,
                });
                dis.dispatch({
                    action: Action.FocusAComposer,
                    context: timelineRenderingType,
                });
            }
        }
        else{
            setFiles([]);
            setSelectedFiles([]);
            dis.dispatch({
                action: "select_files",
                files: [],
                roomId: props.roomId,
                context: timelineRenderingType,
            });
            dis.dispatch({
                action: "select_database",
                database: "",
                roomId: props.roomId,
                context: timelineRenderingType,
            });
        }
    },[spacePopoverOpen])

    const abbreviateFilename = (filename:string):string => {
        const maxLength = 40;  // Maximum length of displayed filename
        if (filename.length > maxLength) {
            return filename.substring(0, maxLength - 3) + '...';  // Cut the filename and append '...'
        }
        return filename;
    };


    // const fetchFileEventsServer = async (rooms: Room[]): Promise<void> => {
    //     const encryptedRooms = [];
    //     const plainRooms = [];
    //     for (const room of rooms) {
    //         if (client.isRoomEncrypted(room.roomId)) {
    //             encryptedRooms.push(room);
    //         } else {
    //             plainRooms.push(room);
    //         }
    //     }

    //     const plainFilter = new Filter(client.getSafeUserId());
    //     plainFilter.setDefinition({
    //         room: {
    //             timeline: {
    //                 contains_url: true,
    //                 types: ["m.room.message"],
    //             },
    //         },
    //     });

    //     plainFilter.filterId = await client.getOrCreateFilter(
    //         "FILTER_FILES_PLAIN_" + client.credentials.userId,
    //         plainFilter,
    //     );
    //     const plainTimelineSets = plainRooms.map((room) => room.getOrCreateFilteredTimelineSet(plainFilter));
    //     const plainEvents = plainTimelineSets.flatMap((ts) =>
    //         ts.getTimelines().flatMap(async (t) => {
    //             const timeline = t.fork(Direction.Forward);
    //             let next = true;
    //             while (next) {
    //                 await client.paginateEventTimeline(timeline, { backwards: true });
    //                 next = timeline.getPaginationToken(Direction.Backward) !== null;
    //             }
    //             return timeline.getEvents().filter((ev) => ev.getContent().file);
    //         }),
    //     );

    //     const encryptedFilter = new Filter(client.getSafeUserId());
    //     encryptedFilter.setDefinition({
    //         room: {
    //             timeline: {
    //                 types: ["m.room.encrypted"],
    //             },
    //         },
    //     });

    //     encryptedFilter.filterId = await client.getOrCreateFilter(
    //         "FILTER_FILES_ENCRYPTED_" + client.credentials.userId,
    //         encryptedFilter,
    //     );
    //     const encryptedTimelineSets = encryptedRooms.map((room) =>
    //         room.getOrCreateFilteredTimelineSet(encryptedFilter),
    //     );
    //     const encryptedEvents = encryptedTimelineSets.flatMap((ts) =>
    //         ts.getTimelines().flatMap(async (t) => {
    //             const timeline = t.fork(Direction.Forward);
    //             let next = true;
    //             while (next) {
    //                 await client.paginateEventTimeline(timeline, { backwards: true });
    //                 next = timeline.getPaginationToken(Direction.Backward) !== null;
    //             }
    //             return timeline.getEvents().filter((ev) => ev.getContent().file);
    //         }),
    //     );

    //     Promise.all([...plainEvents, ...encryptedEvents]).then((results) => {
    //         const finalResults = results.flat();
    //         const roomResults = rooms
    //             .flatMap((r) =>
    //                 r.getTimelineSets().flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents())),
    //             )
    //             .filter((ev) => ev.getContent().url || ev.getContent().file);
    //         setEvents([...roomResults, ...finalResults]);
    //     });
    // };
    const onConfirm = () => {
        setSpacePopoverOpen(false)
    }
    
    return (
        <div className="flex items-center justify-center place-content-center w-[26px] h-[26px]">
        <Popover open={spacePopoverOpen} onOpenChange={setSpacePopoverOpen}>
            <PopoverTrigger asChild className="border-0 flex items-center justify-center bg-transparent !w-[26px] !h-[26px]">
                <div className="flex items-center justify-center place-content-center w-[26px] h-[26px] mx_MessageComposer_button files_button" onClick={onClick} />
            </PopoverTrigger>
            <PopoverContent
            className="!p-1 relative"
            side="top"
            align="start"
            sideOffset={6}
            >
            <Command>
                  <CommandInput
                    placeholder="Search by Filename..."
                    className="text-xs"
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                    {files.map((file, index) => (
                        <CommandItem
                          className="text-xs"
                          key={index}
                          value={file["fileName"]}
                          onSelect={() => {
                            if(!selectedFiles.includes(file)){
                            setSelectedFiles((pres) => 
                            {  
                                const temp = [...pres,files[index]];
                                return temp
                            })
                          }else{
                            setSelectedFiles((pres) => 
                            {  
                                const temp = pres.filter((f) => f["fileName"] !== file["fileName"]);
                                return temp
                            })
                            // props.fileSelect(file)
                          }
                        }
                        }
                        >
                        
                        {abbreviateFilename(file["fileName"])}
                        {selectedFiles.includes(file) && (
                            <IconCheckBold className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <div className="flex justify-end">
                    {files.length>0?<Button className="text-xs h-7" size="sm" variant="default" onClick={onConfirm}>confirm</Button>:''}
                </div>
                
            </PopoverContent>
        </Popover>
        </div>
    )
}
        
        
        
        
        
        
        
        