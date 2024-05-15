import React, { useState } from "react";
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { format, parseISO, isToday } from "date-fns";

import { TemplateActions } from "@/components/reports/TemplateActions";
import { Button } from "@/components/ui/button";
// import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@/components/ui/Icon";
import { Template } from "@/plugins/reports/types";
import { Badge } from "@/components/ui/badge";

export const TemplateList = ({
    templates,
    selectTemplate,
}: {
    templates: Template[];
    selectTemplate: (template: Template) => void;
}): JSX.Element => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns: ColumnDef<Template>[] = [
        {
            accessorKey: "name",
            header: ({ column }): JSX.Element => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-auto"
                    >
                        Title
                        <Icon name="ArrowUpDown" className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <Button onClick={selectTemplate.bind(null, row.original)} variant="link">
                    {row.getValue("name")}
                </Button>
            ),
        },
        {
            accessorKey: "type",
            header: ({ column }): JSX.Element => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-auto"
                    >
                        Type
                        <Icon name="ArrowUpDown" className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="ml-3">
                    <Badge
                        className="uppercase tracking-wide text-[10px] leading-none p-1 text-muted-foreground"
                        variant="secondary"
                    >
                        {row.getValue("type") === "document" ? "Document" : "Template"}
                    </Badge>
                </div>
            ),
        },
        {
            accessorKey: "timestamp",
            // header: () => <div className="text-right">Last Modified</div>,
            header: ({ column }): JSX.Element => {
                return (
                    <div className="w-fit text-left">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="text-left"
                        >
                            Last Modified
                            <Icon name="ArrowUpDown" className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }): JSX.Element => {
                const date = parseISO(row.getValue("timestamp"));

                const formatted = isToday(date) ? format(date, "h:mm a") : format(date, "MMM d, yyyy");

                return <div className="text-left ml-3">{Number(row.original.id) < 0 ? "–" : formatted}</div>;
            },
        },
        {
            accessorKey: "status",
            header: ({ column }): JSX.Element => {
                return <div>Status</div>;
            },
            cell: ({ row }) => <div>{row.getValue("status") ?? `Draft`}</div>,
        },
        {
            id: "actions",
            cell: ({ row }) => <TemplateActions row={row.original} />,
            size: 20,
        },
    ];

    const table = useReactTable({
        data: templates,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: (row) => row.id.toString(),
        state: {
            sorting,
        },
    });
    return (
        <div className="w-full">
            {/* <div className='flex items-center py-4'>
        <Input
          placeholder='Filter reports...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
      </div> */}
            <div className="">
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
                                <TableRow key={row.id}>
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
};
