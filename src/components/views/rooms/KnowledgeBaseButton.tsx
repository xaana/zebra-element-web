import { CollapsibleButton } from "matrix-react-sdk/src/components/views/rooms/CollapsibleButton";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import React, { useContext } from "react";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";


export const KnowledgeBaseButton = ({toggleButtonMenu}:{toggleButtonMenu: () => void}): JSX.Element => {
    const { roomId, timelineRenderingType } = useContext(RoomContext);
    const handleClick = () => {
        dis.dispatch({
            action: "select_knowledge",
            knowledge: true,
            roomId: roomId,
            context: timelineRenderingType,
        });
        dis.dispatch({
            action: Action.FocusAComposer,
            context: timelineRenderingType,
        });
        toggleButtonMenu();
    };
    

    return (
        <CollapsibleButton
            style={{ color: "#7B6AE0" }}
            title="Ziggy"
            className="mx_MessageComposer_button"
            iconClassName="knowledge_button"
            onClick={handleClick}
        />
    );
};