import React from "react";
import { TimelineRenderingType } from "matrix-react-sdk/src/contexts/RoomContext";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { X } from "lucide-react";

import { IconDatabase } from "./icons";

// import { IconDatabase } from './icons';

// Define a functional component
const DatabasePill = ({
    database,
    timelineRenderingType,
    roomId,
}: {
    database: string | undefined;
    timelineRenderingType?: TimelineRenderingType;
    roomId?: string;
}): React.JSX.Element | null => {
    // Styles for the pill container
    const cancelQuoting = (): void => {
        dis.dispatch({
            action: "select_database",
            database: "",
            roomId: roomId,
            context: timelineRenderingType,
        });
    };

    if (!database) return null;
    return (
        <div className="inline-block px-2 bg-muted rounded-full gap-2">
            <div className="flex flex-row text-xs">
                <IconDatabase />
                <span>{database}</span>

            { (timelineRenderingType || roomId) && <X onClick={() => cancelQuoting()} className="cursor-pointer" size={16} />}
            </div>
        </div>
    );
};

export default DatabasePill;
