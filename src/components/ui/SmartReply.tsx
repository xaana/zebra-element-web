import React from "react";
import { MatrixClient } from "matrix-js-sdk/src/client";

import { Button } from "./button";

// Define a functional component
const SmartReply = ({
    reply,
    client,
    roomId,
    setReply,
}: {
    reply: string;
    client: MatrixClient;
    roomId?: string;
    setReply: () => void;
}): React.JSX.Element | null => {
    const send = (): void => {
        const content = {
            msgtype: "m.text",
            body: reply,
        };
        roomId && client.sendMessage(roomId, content);
    };

    return (
        <Button
            className="px-4 ml-4 h-6 text-xs rounded-lg w-fit items-center flex smart-reply-btn"
            // variant="outline"
            onClick={() => {
                send();
                setReply();
            }}
        >
            {reply}
        </Button>
        // <ChatBubble name="MessageSquare" className='h-7 w-20'>
        //   {reply}
        // </ChatBubble>
    );
};

export default SmartReply;
