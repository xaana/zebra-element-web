import { NodeViewWrapper, NodeViewWrapperProps} from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { Loader } from "@/components/ui/Loader";
import {Panel, PanelHeadline} from "@/components/ui/Panel";

const selectMonkData = {
    // Monk data
    availableMediaIdsByUsers: ["123.pdf", "456.pdf"],
    availableMediaIdsByRooms: {
        "room1": ["user1_1.pdf", "user1_2.pdf"],
        "room2": ["user2_1.pdf", "user2_2.pdf"],
    },
}

export interface PdfDataProps {
    availableMediaIdsByUsers: string[]              // PDFs queried using UserID
    availableMediaIdsByRooms: {
        [key: string]: string[]                     // PDFs queried using RoomID
    }
    userId: string | undefined                      // UserID
    roomId: string | undefined                      // RoomID
}

export const PdfQueryMainView = ({editor,node,getPos,deleteNode,}:NodeViewWrapperProps) => {
    const [data, setData] = useState<PdfDataProps>({
        availableMediaIdsByUsers: [],
        availableMediaIdsByRooms: {},
        userId:  undefined,
        roomId:  undefined,
    });
    const [selectedMediaId, setSelectedMediaId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const [currentFilter, setCurrentFilter] = useState<string>("");
    const [currentRoom, setCurrentRoom] = useState<string>("");

    useEffect(() => {
        setLoading(true);
        // fetch("urls")
        setTimeout(()=>{
            setLoading(false);
            setData({
                availableMediaIdsByUsers: [...selectMonkData.availableMediaIdsByUsers, "123","456"],
                availableMediaIdsByRooms: {...selectMonkData.availableMediaIdsByRooms},
                userId: "testUser",
                roomId: Object.keys(selectMonkData.availableMediaIdsByRooms)[0],
            })
            setCurrentFilter("user");
            setCurrentRoom(Object.keys(selectMonkData.availableMediaIdsByRooms)[0])
        }, 2500)
    }, []);

    const handleFilterSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentFilter(e.target.value)
    }

    const handleRoomSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentRoom(e.target.value);
    }

    const handleMediaSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMediaId(e.target.value)
    }

    return (
        <NodeViewWrapper data-drag-handle>
            <Panel noShadow className-="w-full">
                <div className="flex flex-col p-1">
                    {loading && <Loader label="Searching Database..."/>}
                </div>
                <div className="w-full mb-4">
                    <PanelHeadline asChild >
                        <h6>Select your documentation from below</h6>
                    </PanelHeadline>
                </div>
                <div className='flex flex-row items-center justify-between gap-1'>
                    <select
                        value={currentFilter}
                        onChange={handleFilterSelected}
                        className="flex-1"
                    >
                        <option key="user" value="user">Filtered By User</option>
                        <option key="room" value="room">Filtered By Room</option>
                    </select>
                    <select
                        value={currentFilter==="user" ? selectedMediaId : currentRoom}
                        onChange={currentFilter==="user" ? handleMediaSelected : handleRoomSelected}
                        className="flex-1"
                    >
                        {currentFilter!=="user" ? Object.keys(data.availableMediaIdsByRooms).map((key)=>(
                            <option key={key} value={key}>{key}</option>
                        )) : data.availableMediaIdsByUsers.map((key)=>(
                            <option key={key} value={key}>{key}</option>
                        ))}
                    </select>
                    {currentFilter !== "user" && <select
                        disabled={currentFilter === "user"}
                        value={selectedMediaId}
                        onChange={handleMediaSelected}
                        className="flex-1"
                    >
                        {data.availableMediaIdsByRooms[currentRoom] && data.availableMediaIdsByRooms[currentRoom].map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>}
                </div>
            </Panel>
        </NodeViewWrapper>
    )
}

