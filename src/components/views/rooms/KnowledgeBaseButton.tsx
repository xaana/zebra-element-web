import { CollapsibleButton } from "matrix-react-sdk/src/components/views/rooms/CollapsibleButton";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import React, { useContext } from "react";
import { OverflowMenuContext } from "./MessageComposerButtons";


export const KnowledgeBaseButton = (s): JSX.Element => {
    const { roomId, timelineRenderingType } = useContext(RoomContext);
    const handleClick = () => {
        dis.dispatch({
            action: "select_knowledge",
            knowledge: true,
            roomId: roomId,
            context: timelineRenderingType,
        });
    };
    

    return (
        <CollapsibleButton
            style={{ color: "#7B6AE0" }}
            title="Knowledge Base"
            className="mx_MessageComposer_button"
            iconClassName="knowledge_button"
            onClick={handleClick}
        />
    );
};