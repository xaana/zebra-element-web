import React from "react";
import { TimelineRenderingType } from "matrix-react-sdk/src/contexts/RoomContext";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import {  X } from "lucide-react";
import { IconKnowledge } from "./icons";

// import { IconDatabase } from './icons';

// Define a functional component
const KnowledgePill = ({roomId,timelineRenderingType}:{roomId?:string;timelineRenderingType?: TimelineRenderingType}): React.JSX.Element | null => {
    // Styles for the pill container
    const cancelQuoting = (): void => {
        dis.dispatch({
            action: "select_knowledge",
            knowledge: false,
            roomId: roomId,
            context: timelineRenderingType,
        });
    };

    return (
        <div className="inline-block px-2 py-1 bg-muted rounded-full">
            <div className="flex gap-2 text-xs">
                <IconKnowledge />
                <span>Ziggy</span>

                {(timelineRenderingType || roomId) && (
                    <X onClick={() => cancelQuoting()} className="cursor-pointer" size={16} />
                )}
            </div>
        </div>
    );
};

export default KnowledgePill;
