import React, { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row, RowSelectionState } from "@tanstack/react-table";

import { IconZebra } from "../ui/icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

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

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
    onDelete?: (currentFile: any) => void;
    mode: "dialog" | "standalone";
    userId: string;
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export function DataTableRowActions<TData>({
    row,
    onDelete,
    mode,
    userId,
    setRowSelection,
}: DataTableRowActionsProps<TData>): JSX.Element {
    // const matrixClient = useMatrixClientContext();
    const [dialogOpen, setDialogOpen] = useState(false);
    // const onDelete = ():void => {
    //     const currentFile = row.original as File;
    //     const roomId = currentFile.roomId;
    //     const eventId = currentFile.mxEvent?.getId();
    //     eventId&&client.redactEvent(roomId, eventId,undefined,{reason: "Manually delete the file in file manager by user."});
    // }
    const handleDialogOpenChange = async (open: boolean): Promise<void> => {
        if (open) {
            setDialogOpen(open);
        } else {
            setDialogOpen(false);
        }
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    {/* <DropdownMenuItem>
                        AI Query
                        <DropdownMenuShortcut>
                            <IconZebra className="h-5 w-5" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem> */}

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
                    <div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                            Delete
                            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            {userId === row.original.sender && (
                <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this file?</DialogTitle>
                            <DialogDescription>
                                The action will delete the file permanently, the message will be unrecoverable.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    onDelete?.(row.original);
                                    setRowSelection({});
                                    setDialogOpen(false);
                                }}
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
