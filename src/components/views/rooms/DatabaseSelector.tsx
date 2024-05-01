import React, { useContext, useEffect, useState } from "react";
// import { ComposerInsertPayload } from "matrix-react-sdk/src/dispatcher/payloads/ComposerInsertPayload";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

import "./style/button.css";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const DatabaseSelector = () => {
    const [dbList, setDbList] = useState<Array<string>>([]);
    const { roomId, timelineRenderingType } = useContext(RoomContext);
    const [spacePopoverOpen, setSpacePopoverOpen] = useState(false);

    useEffect(() => {
        let apiUrl;

        const getDbList = async (): Promise<void> => {
            apiUrl = SettingsStore.getValue("botApiUrl");
            if (apiUrl) {
                const resp = await fetch(`${apiUrl}/database_list`);
                const data = await resp.json();
                if (data) setDbList(data);
            }
        };

        getDbList();
    }, []);

    return (
        <div className="flex items-center justify-center place-content-center w-[26px] h-[26px]">
            <Popover open={spacePopoverOpen} onOpenChange={setSpacePopoverOpen}>
                <PopoverTrigger
                    asChild
                    className="border-0 flex items-center justify-center bg-transparent !w-[26px] !h-[26px]"
                    onClick={() => {
                        dis.dispatch({
                            action: "select_database",
                            database: "",
                            roomId: roomId,
                            context: timelineRenderingType,
                        });
                        dis.dispatch({
                            action: "select_files",
                            files: [],
                            roomId: roomId,
                            context: timelineRenderingType,
                        });
                    }}
                >
                    <div className="flex items-center justify-center place-content-center w-[26px] h-[26px] mx_MessageComposer_button database_button" />
                </PopoverTrigger>
                <PopoverContent className="!p-1" side="top" align="start" sideOffset={6}>
                    <Command>
                        <CommandInput placeholder="Search by Database Name..." className="text-xs" />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {dbList.map((db, index) => (
                                    <CommandItem
                                        className="text-xs"
                                        key={index}
                                        value={db}
                                        onSelect={() => {
                                            // setSelectedDb(() => dbList[index])
                                            setSpacePopoverOpen(false);
                                            //   dis.dispatch({
                                            //     action: Action.ComposerInsert,
                                            //     text: dbList[index],
                                            //     timelineRenderingType: timelineRenderingType,
                                            // });
                                            dis.dispatch({
                                                action: "select_database",
                                                database: dbList[index],
                                                roomId: roomId,
                                                context: timelineRenderingType,
                                            });
                                            dis.dispatch({
                                                action: Action.FocusAComposer,
                                                context: timelineRenderingType,
                                            });
                                        }}
                                    >
                                        {db}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
