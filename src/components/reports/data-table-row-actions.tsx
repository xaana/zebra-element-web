import React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";
import { Alignment } from "matrix-react-sdk/src/components/views/elements/Tooltip";

import { Icon } from "../ui/Icon";
import { IconPdfDoc, IconWordDoc } from "../ui/icons";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const report = row.original;
    return (
        <div className="flex items-center justify-end gap-4">
            <AccessibleTooltipButton className="p-2" title="Edit" alignment={Alignment.Top} onClick={() => {}}>
                <Icon name="Pencil" className="w-4 h-4" />
            </AccessibleTooltipButton>
            <AccessibleTooltipButton className="p-2" title="Duplicate" alignment={Alignment.Top} onClick={() => {}}>
                <Icon name="Copy" className="w-4 h-4" />
            </AccessibleTooltipButton>
            <AccessibleTooltipButton className="p-2" title="Delete" alignment={Alignment.Top} onClick={() => {}}>
                <Icon name="Trash2" className="w-4 h-4" />
            </AccessibleTooltipButton>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <AccessibleTooltipButton title="Download" alignment={Alignment.Top} onClick={() => {}}>
                        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                            <Icon name="ArrowDownToLine" className="w-4 h-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </AccessibleTooltipButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem>
                        PDF
                        <DropdownMenuShortcut>
                            <IconPdfDoc className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Doc
                        <DropdownMenuShortcut>
                            <IconWordDoc className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
