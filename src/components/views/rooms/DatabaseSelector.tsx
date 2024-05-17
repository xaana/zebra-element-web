import React, { useContext, useEffect, useState } from "react";
// import { ComposerInsertPayload } from "matrix-react-sdk/src/dispatcher/payloads/ComposerInsertPayload";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

import "./style/button.css";
import { CollapsibleButton } from "matrix-react-sdk/src/components/views/rooms/CollapsibleButton";

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
        <Popover open={spacePopoverOpen} onOpenChange={setSpacePopoverOpen}>
            <PopoverTrigger
                style={{ padding: 0 }}
                // asChild
                // onClick={() => {
                //     dis.dispatch({
                //         action: "select_database",
                //         database: "",
                //         roomId: roomId,
                //         context: timelineRenderingType,
                //     });
                //     dis.dispatch({
                //         action: "select_files",
                //         files: [],
                //         roomId: roomId,
                //         context: timelineRenderingType,
                //     });
                // }}
            >
                <CollapsibleButton
                    style={{ borderRadius: 0, padding: "8px 16px 8px 11px" }}
                    title="Select Database"
                    className="mx_MessageComposer_button z-[-100]"
                    iconClassName="database_button"
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
                        console.log("open database selector");
                    }}
                />
                {/* <div className="flex items-center justify-center place-content-center w-[26px] h-[26px] mx_MessageComposer_button database_button" /> */}
            </PopoverTrigger>
            <PopoverContent className="!p-1" side="left" align="start" sideOffset={6}>
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
    );
};
