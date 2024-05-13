import React from "react";
import { TimelineRenderingType } from "matrix-react-sdk/src/contexts/RoomContext";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { FileText, X } from "lucide-react";

import { DocFile } from "../views/rooms/FileSelector";

// Define a functional component
const FilesPill = ({
    files,
    timelineRenderingType,
    roomId,
}: {
    files: DocFile[] | undefined;
    timelineRenderingType?: TimelineRenderingType;
    roomId?: string;
}): React.JSX.Element | null => {
    // Styles for the pill container
    const cancelQuoting = (): void => {
        dis.dispatch({
            action: "select_files",
            files: [],
            roomId: roomId,
            context: timelineRenderingType,
        });
    };

    if (!files || (files && files.length === 0)) return null;

    return (
        <div className="py-2 px-4 bg-muted rounded-lg gap-2">
            <div className="relative">
                {timelineRenderingType ||
                    (roomId && (
                        <X onClick={() => cancelQuoting()} className="cursor-pointer top-0 right-0 absolute text-xs" />
                    ))}
            </div>
            {files &&
                files.map((file) => {
                    return (
                        <div className="flex flex-row text-sm" key={file.mediaId}>
                            <FileText size={16} />
                            <span>{file.name}</span>
                        </div>
                    );
                })}
        </div>
    );
};

export default FilesPill;
