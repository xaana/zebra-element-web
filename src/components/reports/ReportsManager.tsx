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
import { formatDistanceToNow } from "date-fns";

import { DataTableRowActions } from "./data-table-row-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@/components/ui/Icon";
export type Report = {
    id: string;
    title: string;
    timestamp: string;
};

// const reportsData: Report[] = [
//     {
//         id: "1",
//         title: "Report 1",
//         timestamp: new Date().toISOString(),
//     },
//     {
//         id: "2",
//         title: "Report 2",
//         timestamp: new Date().toISOString(),
//     },
//     {
//         id: "3",
//         title: "Report 3",
//         timestamp: new Date().toISOString(),
//     },
// ];

export const columns: ColumnDef<Report>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Title
                    <Icon name="ArrowUpDown" className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
        accessorKey: "timestamp",
        // header: () => <div className="text-right">Last Modified</div>,
        header: ({ column }) => {
            return (
                <div className="w-full text-right">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Last Modified
                        <Icon name="ArrowUpDown" className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const date: Date = row.getValue("timestamp");

            // Format the amount as a dollar amount
            const formatted = formatDistanceToNow(new Date(date), {
                addSuffix: true,
            });

            return <div className="text-right">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
        size: 20,
    },
];

export const ReportsManager = ({
    reports,
    onNewReport,
    onEditReport,
}: {
    reports: Report[];
    onNewReport: () => void;
    onEditReport: (report: Report) => void;
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    // const [reports, setReports] = useState<Report[]>(reportsData);
    const table = useReactTable({
        data: reports,
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
        <div className="max-w-screen-lg mx-auto px-3 py-6">
            <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Reports Manager</h2>
                    <p className="text-muted-foreground text-base">
                        Create new reports and view/manage previously created reports.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="font-semibold" onClick={onNewReport} size="sm">
                        <Icon name="SquarePen" className="mr-2" />
                        New Report
                    </Button>
                </div>
            </div>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter reports..."
                        value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
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
        </div>
    );
};
