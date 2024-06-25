import { MatrixClient } from "matrix-js-sdk/src/client";
import { ButtonEvent } from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";
import { _t } from "matrix-react-sdk/src/languageHandler";
import { DirectoryMember, startDmOnFirstMessage } from "matrix-react-sdk/src/utils/direct-messages";
import { findDMRoom } from "matrix-react-sdk/src/utils/dm/findDMRoom";
import React from "react";

interface ISendButtonProps {
    onClick: (ev: ButtonEvent) => void;
    title?: string; // defaults to something generic
}

function SendButton(props: ISendButtonProps): JSX.Element {
    return (
        <AccessibleTooltipButton
            className="mx_MessageComposer_sendMessage mr-1"
            onClick={props.onClick}
            title={props.title ?? _t("composer|send_button_title")}
            data-testid="sendmessagebtn"
        />
    );
}

const HomePageInput = ({
    mxClient,
}: {
    mxClient: MatrixClient;
}): React.JSX.Element | null => {
    const [content, setContent] = React.useState("");
    const botDM = new DirectoryMember({
        user_id: "@zebra:securezebra.com",
        display_name: "zebra",
    });
    const targetDMRoom = findDMRoom(mxClient, [botDM]);
    const handleSendMessage = () => {
        
        startDmOnFirstMessage(mxClient, [botDM]).then((roomId) => {
            if (targetDMRoom){
                mxClient.sendMessage(targetDMRoom.roomId, { msgtype: "m.text", body: content });
            }
            else if(roomId){
                mxClient.sendMessage(roomId, { msgtype: "m.text", body: "Init from homepage..." }).then((response) => {
                    mxClient.redactEvent(roomId, response.event_id, undefined, { reason: "Init message" });
                });
                mxClient.sendMessage(roomId, { msgtype: "m.text", body: content });
            }
        });
        setContent(""); // Clear the input field after sending the message
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && content) {
            handleSendMessage();
        }
    };

    return (
        <div className="border-t border border-gray-300 rounded-md flex flex-row justify-center items-center w-3/5">
            <input 
                type="text" 
                placeholder="Send a message..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full h-full !border-0 border-solid mr-1" 
            />
            {content && <SendButton onClick={handleSendMessage} />}
        </div>
    )
}

export default HomePageInput;
