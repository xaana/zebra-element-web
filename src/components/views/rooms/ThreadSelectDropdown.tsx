import React from "react";
import { Room, MatrixEvent } from "matrix-js-sdk/src/matrix";
import { Check, ChevronsUpDown  } from "lucide-react";
import { ShowThreadPayload } from "matrix-react-sdk/src/dispatcher/payloads/ShowThreadPayload";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { RightPanelPhases } from "matrix-react-sdk/src/stores/right-panel/RightPanelStorePhases";
import RightPanelStore from "matrix-react-sdk/src/stores/right-panel/RightPanelStore";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import { TimelineRenderingType } from "matrix-react-sdk/src/contexts/RoomContext";

import { cn } from "../../../lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "../../ui/command"; 
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../ui/popover" ;
import { Button } from "../../ui/button";
import type { Thread } from "matrix-js-sdk/src/matrix";

interface Props {
    room: Room;
    mxEvent?: MatrixEvent;
    initialOption?: string;
}
   
export const ThreadSelectDropdown: React.ReactNode = (props: Props) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState("");
    const [threads, setThreads]= React.useState(()=>props.room.getThreads());
    
    React.useEffect(()=>{
        const updatedThreads = props.room.getThreads();
        setThreads(updatedThreads);
        dis.register((payload)=>{
            if (payload.action === Action.ShowThread) {
                const { rootEvent, initialEvent, highlighted, scrollIntoView, push } = payload as ShowThreadPayload;
                const threadViewCard = {
                    phase: RightPanelPhases.ThreadView,
                    state: {
                        threadHeadEvent: rootEvent,
                        initialEvent: initialEvent,
                        isInitialEventHighlighted: highlighted,
                        initialEventScrollIntoView: scrollIntoView,
                    },
                };
                if (push ?? false) {
                    RightPanelStore.instance.pushCard(threadViewCard);
                } else {
                    RightPanelStore.instance.setCards([{ phase: RightPanelPhases.ThreadPanel }, threadViewCard]);
                }
                dis.dispatch({
                    action: Action.FocusSendMessageComposer,
                    context: TimelineRenderingType.Thread,
                });
            }
        })
    },[props.room])
    
    const onSelectHandler = (thread: Thread): void => {
        if (thread?.rootEvent) {
            dis.dispatch<ShowThreadPayload>({
                action: Action.ShowThread,
                rootEvent: thread.rootEvent
            });
        }
    }
    

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-8 w-[160px] justify-between text-sm"
                    onClick={()=>{
                        if (props.room.getThreads()!==threads){
                            setThreads(props.room.getThreads().reverse());
                        }
                    }}
                >   
                    Select Thread...
                    {/* {value
                        ? threads.find((thread) => thread.id === value)?.id
                        : "Select Thread..."} */}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[160px] p-0">
                <Command>
                    {threads ? (<CommandList> 
                        <CommandEmpty>No Thread Info Found.</CommandEmpty>
                        <CommandGroup>
                            {threads.map((item,index)=>{
                                return (
                                    <CommandItem
                                        className=" text-gray-900 hover:text-gray-100"
                                        key={index}
                                        value={item.id}
                                        onSelect={(currentId)=>{
                                            onSelectHandler(item);
                                            setValue(currentId===value?"":currentId);
                                            setOpen(false);
                                        }}>
                                        {console.log(item.rootEvent?.getContent())}
                                        {/* {item.rootEvent?.getContent().msgtype === "m.bad.encrypted" ? "Undecrypted Message" : item.rootEvent?.getContent().body } */}
                                        <ThreadSelectItem thread={item} />
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>) : <CommandInput placeholder="Search Thread..." />}
                    
                </Command>
            </PopoverContent>
        </Popover>
    )
}

const ThreadSelectItem: React.ReactNode = (props: {thread: Thread}) => {
    const {thread} = props;
    const messageContent = thread.rootEvent?.getContent();
    const date = new Date(thread.rootEvent?.localTimestamp);
    let messageText;

    switch (messageContent?.msgtype) {
        case "m.text":
            messageText = messageContent.body; // Message (In str format)
            break;
        case "m.notice":
            messageText = 
                messageContent.alertContent 
                ? messageContent.alertContent.title // Alert Card Title
                : messageContent.body; // General Content
            break;
        case "m.image":
            break;
        case "m.sticker":
            break;
        case "m.video":
            break;
        case "m.audio":
            messageText = messageContent.body; // Voice Message
            break;
        case "m.file":
            messageText = messageContent.body; // Filename
            break;
        case "m.location":
            break;
        case "m.bad.encrypted":
            messageText = "Undecrypted Message";
            break;
        default:
            messageText = messageContent.body
            break;
    }

    return (
        <div className="bg-transparent">
            <p>{messageText}</p>
            <p>{date.toLocaleString}</p>
        </div>
    )
}