import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export type Citation = {
    id: string;
    question: string;
    page_num: number;
    doc_name: string;
    doc_number: number;
    bboxes: string;
};

export type BoundingBox = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    page?: number;
};

export function CitationsTable({
    data,
    onViewCitation,
}: {
    data: Citation[];
    onViewCitation: (documentName: string, pageNumber: string, bboxes: BoundingBox[]) => void;
}) {
    const columns: ColumnDef<Citation>[] = [
        {
            accessorKey: "question",
            header: "Query",
            cell: ({ row }) => <div className="font-normal text-xs capitalize">{row.getValue("question")}</div>,
        },
        {
            accessorKey: "page_num",
            header: "Citation Source",
            cell: ({ row }) => <div className="font-normal text-xs capitalize">Page {row.getValue("page_num")}</div>,
        },
    ];

    if (new Set(data.map((citation) => citation.doc_number)).size > 1) {
        columns.push({
            accessorKey: "doc_name",
            header: "Document",
            cell: ({ row }) => <div className="font-normal text-xs truncate">{row.getValue("doc_name")}</div>,
        });
    }

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Parse the bounding boxes
    const parseBoundingBoxes = (bboxes: string): BoundingBox[] => {
        return bboxes.split(";").map((bbox) => {
            const [x1, y1, x2, y2] = bbox.split(" ").map(parseFloat);
            return { x1, y1, x2, y2 };
        });
    };

    return (
        <>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead className="font-normal" key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody className="border-b">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="cursor-pointer"
                                onClick={async () =>
                                    await onViewCitation(
                                        row.original["doc_name"],
                                        String(row.original["page_num"]),
                                        parseBoundingBoxes(row.original["bboxes"]),
                                    )
                                }
                            >
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
            {/* {!(!table.getCanNextPage() && !table.getCanPreviousPage()) && (
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
      )} */}
        </>
    );
}
