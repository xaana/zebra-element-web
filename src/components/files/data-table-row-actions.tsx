import React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { IconZebra } from "../ui/icons";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    // DropdownMenuRadioGroup,
    // DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    // DropdownMenuSub,
    // DropdownMenuSubContent,
    // DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { File } from '@/plugins/files/types';



interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    onDelete?: (currentFile:any) => void;
}

export function DataTableRowActions<TData>({ row,onDelete }: DataTableRowActionsProps<TData>): JSX.Element {
    // const matrixClient = useMatrixClientContext();
    
    // const onDelete = ():void => {
    //     const currentFile = row.original as File;
    //     const roomId = currentFile.roomId;
    //     const eventId = currentFile.mxEvent?.getId();
    //     eventId&&client.redactEvent(roomId, eventId,undefined,{reason: "Manually delete the file in file manager by user."});
    // }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <DotsHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem>
                    AI Query
                    <DropdownMenuShortcut>
                        <IconZebra className="h-5 w-5" />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.label}>
              {labels.map((label) => (
                <DropdownMenuRadioItem key={label.value} value={label.value}>
                  {label.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
                <DropdownMenuItem onClick={()=>onDelete&&onDelete(row.original)}>
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
