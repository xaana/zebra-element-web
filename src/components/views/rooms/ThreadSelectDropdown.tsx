import React from "react";
import { Room, MatrixEvent } from "matrix-js-sdk/src/matrix";
import { ChevronsUpDown } from "lucide-react";
import { ShowThreadPayload } from "matrix-react-sdk/src/dispatcher/payloads/ShowThreadPayload";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { RightPanelPhases } from "matrix-react-sdk/src/stores/right-panel/RightPanelStorePhases";
import RightPanelStore from "matrix-react-sdk/src/stores/right-panel/RightPanelStore";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import { TimelineRenderingType } from "matrix-react-sdk/src/contexts/RoomContext";

import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import type { Thread } from "matrix-js-sdk/src/matrix";

import { Label } from "@/components/ui/label";

interface Props {
    room: Room;
    mxEvent?: MatrixEvent;
    initialOption?: string;
}

export const ThreadSelectDropdown = (props: Props): React.JSX.Element => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [value, setValue] = React.useState("");
    const [threads, setThreads] = React.useState(() => props.room.getThreads());

    React.useEffect(() => {
        const updatedThreads = props.room.getThreads();
        setThreads(updatedThreads);
        dis.register((payload) => {
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
        });
    }, [props.room]);

    const getLatestTimestamp = (thread: Thread): number|undefined => {
        return thread.timeline.length ? thread.timeline.slice(-1)[0].localTimestamp : thread.rootEvent?.localTimestamp;
    };

    const groupThreadsByDate = (threads: Thread[]): {today:Thread[],lastWeek:Thread[],earlier:Thread[]} => {
        const today = new Date();
        const oneDay = 1000 * 60 * 60 * 24;
        const groups: {today:Thread[],lastWeek:Thread[],earlier:Thread[]} = {
          today: [],
          lastWeek: [],
          earlier: []
        };
      
        threads.forEach(thread => {
            const timestamp = getLatestTimestamp(thread);
            if (!timestamp) return;
            const itemDate = new Date(timestamp);
            const diffDays = Math.floor((today - itemDate) / oneDay);
        
            if (diffDays === 0) {
                groups.today.push(thread);
            } else if (diffDays <= 7) {
                groups.lastWeek.push(thread);
            } else {
                groups.earlier.push(thread);
            }
        });
      
        return groups;
      }

    const onSelectHandler = (thread: Thread): void => {
        if (thread?.rootEvent) {
            dis.dispatch<ShowThreadPayload>({
                action: Action.ShowThread,
                rootEvent: thread.rootEvent,
            });
        }
    };

    const groupedThreads = groupThreadsByDate(threads);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-7 w-[160px] justify-between text-sm"
                    onClick={() => {
                        if (props.room.getThreads() !== threads) {
                            setThreads(
                                props.room.getThreads().sort((a, b) => getLatestTimestamp(a) - getLatestTimestamp(b)),
                            );
                        }
                    }}
                >
                    Select Topic
                    {/* {value ? value :"Select Topic..."} */}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0">
                <Command>
                    {threads.length ? (
                        <>
                            <CommandInput placeholder="Search Topic..." />
                            <CommandList>
                                <CommandGroup heading="Today">
                                    {groupedThreads.today
                                        .map((item) => {
                                            return (
                                                <ThreadSelectItem
                                                    key={item.id}
                                                    thread={item}
                                                    id={item.id}
                                                    value={item.id}
                                                    onSelect={(currentId) => {
                                                        onSelectHandler(item);
                                                        setValue(currentId === value ? "" : currentId);
                                                        setOpen(false);
                                                    }}
                                                />
                                            );
                                        })}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="Past Week">
                                    {groupedThreads.lastWeek
                                        .map((item) => {
                                            return (
                                                <ThreadSelectItem
                                                    key={item.id}
                                                    thread={item}
                                                    id={item.id}
                                                    value={item.id}
                                                    onSelect={(currentId) => {
                                                        onSelectHandler(item);
                                                        setValue(currentId === value ? "" : currentId);
                                                        setOpen(false);
                                                    }}
                                                />
                                            );
                                        })}
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="More Than One Week">
                                    {groupedThreads.earlier
                                        .map((item) => {
                                            return (
                                                <ThreadSelectItem
                                                    key={item.id}
                                                    thread={item}
                                                    id={item.id}
                                                    value={item.id}
                                                    onSelect={(currentId) => {
                                                        onSelectHandler(item);
                                                        setValue(currentId === value ? "" : currentId);
                                                        setOpen(false);
                                                    }}
                                                />
                                            );
                                        })}
                                </CommandGroup>
                            </CommandList>
                        </>
                    ) : (
                        <Label className="py-6 text-center text-sm">No Topic Found</Label>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const ThreadSelectItem = (props: {
    thread: Thread;
    id: string;
    value: string;
    onSelect: (currentId: string) => void;
}): React.JSX.Element => {
    const { thread, id, value, onSelect } = props;
    const messageContent = thread.rootEvent?.getContent();
    let messageText;

    switch (messageContent?.msgtype) {
        case "m.text":
            messageText = messageContent.body; // Message (In str format)
            break;
        case "m.notice":
            messageText = messageContent.alertContent
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
            messageText = messageContent.body;
            break;
    }

    return (
        <CommandItem className=" text-gray-900 hover:text-gray-100" key={id} value={value} onSelect={onSelect}>
            <div className="flex flex-row flex-grow bg-transparent justify-end w-full">
                <p className="flex-1 truncate">{messageText.length > 40 ? messageText.substring(0,37)+"...":messageText}</p>
            </div>
        </CommandItem>
    );
};
