import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
    ColumnDef,
    RowSelectionState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

import type { File } from "@/plugins/reports/types";

import { Button } from "@/components/ui/button-alt";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@/components/ui/Icon";

export interface FileSelectorHandle {
    getSelectedFiles: () => File[];
}

export interface FileSelectorProps {
    files: File[];
    rowSelection: RowSelectionState;
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

export const columns: ColumnDef<File>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value);
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                    row.toggleSelected(!!value);
                }}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    <Icon name="ArrowUpDown" className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "owner",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Owner
                    <Icon name="ArrowUpDown" className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("owner")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: () => <div className="text-right">Date Uploaded</div>,
        cell: ({ row }) => {
            const uploadDate: Date = row.getValue("createdAt");

            // Format the amount as a dollar amount
            const formatted = formatDistanceToNow(new Date(uploadDate), {
                addSuffix: true,
            });

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
];

export const FileSelector = forwardRef<FileSelectorHandle, FileSelectorProps>(
    ({ files, rowSelection, setRowSelection }, ref) => {
        const [sorting, setSorting] = useState<SortingState>([]);

        //     const handleRowSelectionChange = (updaterOrValue: any) => {
        //   // Your custom implementation logic goes here
        //   if (typeof updaterOrValue === 'function') {
        //     // Handle the case where updaterOrValue is a function
        //     // const oldState = /* get the current state somehow */
        //     const newState = updaterOrValue(oldState)
        //     // Update the state with the new value
        //   } else {
        //     // Handle the case where updaterOrValue is a value
        //     // Update the state with the new value
        //   }
        // };

        const table = useReactTable({
            data: files,
            columns,
            onSortingChange: setSorting,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getRowId: (row) => row.id.toString(),
            onRowSelectionChange: setRowSelection,
            state: {
                sorting,
                rowSelection,
            },
        });

        useImperativeHandle(ref, () => ({
            getSelectedFiles() {
                return table.getSelectedRowModel().rows.map((row) => row.original) || [];
            },
        }));

        return (
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter files..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{" "}
                        row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        );
    },
);
