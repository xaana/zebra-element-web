import { MatrixClient } from "matrix-js-sdk/src/client";
import { MatrixEvent, Room } from "matrix-js-sdk/src/matrix";
import { isJoinedOrNearlyJoined } from "matrix-react-sdk/src/utils/membership";

export const shouldSetTimeOutForComposer = (event:MatrixEvent, room:Room, client?:MatrixClient) : boolean =>{
    if (event.getSender()==="@zebra:securezebra.com") {
        return false
    }
    if(event.getContent()["m.mentions"]?.user_ids?.includes("@zebra:securezebra.com")){
        return true
    }
    if (event.getContent().forceDatabase||event.getContent().forceDoc||event.getContent().web) {
        return true
    }
    const members = room.getMembers();
    const joinedMembers = members.filter(
        (m) => m.membership && isJoinedOrNearlyJoined(m.membership),
    );
    const userIds = joinedMembers.map((m) => m.userId);
    if ((userIds.length==2&&userIds.includes("@zebra:securezebra.com"))) {
        return true
    }
    return false
}