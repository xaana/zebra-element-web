import React, { useEffect, useState } from "react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { IconCheckBold } from "../../ui/icons"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const DatabaseSelector = (props:any) => {
    const [dbList, setDbList] = useState<Array<string>>([])
    const [selectedDb, setSelectedDb] = useState<string>('')
    const [spacePopoverOpen, setSpacePopoverOpen] = useState(false)
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        fetch(`http://localhost:29316/_matrix/maubot/plugin/1/database_list`, {
            method: "GET",
        }).then((response) => {
            response.json().then((data) => {
                setDbList(data)
            });
        });
        }
          ,[])
        
    useEffect(() => {
        console.log(selectedDb)
    },[selectedDb])


    return (
        <div className="flex items-center justify-center place-content-center w-[26px] h-[26px]">
        <Popover open={spacePopoverOpen} onOpenChange={setSpacePopoverOpen}>
            <PopoverTrigger asChild className="border-0 flex items-center justify-center bg-transparent !w-[26px] !h-[26px]">
                <div className="flex items-center justify-center place-content-center w-[26px] h-[26px] mx_MessageComposer_button mx_UserSettingsDialog_keyboardIcon" />
            </PopoverTrigger>
            <PopoverContent
            className="!p-1"
            side="top"
            align="start"
            sideOffset={6}
            >
            <Command>
                  <CommandInput
                    placeholder="Select Space..."
                    className="text-xs"
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {dbList.map((db, index) => (
                        <CommandItem
                          className="text-xs"
                          key={index}
                          value={db}
                          onSelect={() => {
                            setSelectedDb(() => dbList[index])
                            console.log(props,typeof props.databaseSelect)
                            props.databaseSelect(dbList[index])
                            setSpacePopoverOpen(false)
                          }}
                        >
                          {db}
                          {selectedDb === db && (
                            <IconCheckBold className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        </div>
    )
}
        
        
        
        
        
        
        
        