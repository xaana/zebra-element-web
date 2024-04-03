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

// interface ThreadInfoProps {
//     key: number,
//     id: string,
//     details?: Thread
// }
   
export const ThreadSelectDropdown: React.ReactNode = (props: Props) => {
    const [open, setOpen] = React.useState<boolean>(false);
    // const [threadInfos, setThreadInfos] = React.useState<ThreadInfoProps[]>([]);
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
        // threads.map((thread, index)=>{
        //     setThreadInfos([...threadInfos, {
        //         key: index,
        //         id: thread.id,
        //         details: thread,
        //     }])
        // })
    },[props.room])
    
    const onSelectHandler = (thread: Thread): void => {
        if (thread?.rootEvent) {
            dis.dispatch<ShowThreadPayload>({
                action: Action.ShowThread,
                rootEvent: thread.rootEvent
            });
            console.log("Dispatcher activated");
        }
    }
    

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                    onClick={()=>{
                        if (props.room.getThreads()!==threads){
                            setThreads(props.room.getThreads().reverse());
                        }
                    }}
                >
                    {value
                        ? threads.find((thread) => thread.id === value)?.id
                        : "Select framework..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search framework..." />
                        <CommandEmpty>No Thread Info Found.</CommandEmpty>
                        <CommandGroup>
                            {threads.map((item,index)=>{
                                return (
                                    <CommandItem
                                    key={index}
                                    value={item.id}
                                    onSelect={(currentId)=>{
                                        onSelectHandler(item);
                                        setValue(currentId===value?"":currentId);
                                        setOpen(false);
                                    }}>
                                        <Check 
                                            className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {item.rootEvent?.getContent().body}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}