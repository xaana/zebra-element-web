import * as React from "react";
import {
    ColumnDef,
    Column,
    ColumnFiltersState,
    RowData,
    getFacetedMinMaxValues,
    RowSelectionState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { FileDownloader } from "matrix-react-sdk/src/utils/FileDownloader";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import defaultDispatcher from "matrix-react-sdk/src/dispatcher/dispatcher";
import { format, isToday } from "date-fns";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import type { File } from "@/plugins/files/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { getFile } from "./FileOpsHandler";
import { FilterWrapper as Filter } from "./FilesTableFilter";

import { PluginActions } from "@/plugins";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import {
    IconDocumentPDF,
    IconDocument,
    IconDocumentCSV,
    IconDocumentDB,
    IconDocumentEXE,
    IconDocumentExcel,
    IconDocumentPPT,
    IconDocumentRTF,
    IconDocumentTXT,
    IconDocumentText,
    IconDocumentWord,
    IconDocumentZip,
} from "@/components/ui/icons";


const iconMapping: Record<string, React.ComponentType<React.ComponentProps<"svg">>> = {
    exe: IconDocumentEXE,
    txt: IconDocumentTXT,
    csv: IconDocumentCSV,
    pdf: IconDocumentPDF,
    doc: IconDocumentWord,
    docx: IconDocumentWord,
    docm: IconDocumentWord,
    xls: IconDocumentExcel,
    xlsx: IconDocumentExcel,
    xlsm: IconDocumentExcel,
    xlt: IconDocumentExcel,
    xltx: IconDocumentExcel,
    xltm: IconDocumentExcel,
    ppt: IconDocumentPPT,
    pptx: IconDocumentPPT,
    pptm: IconDocumentPPT,
    rtf: IconDocumentRTF,
    mdb: IconDocumentDB,
    accdb: IconDocumentDB,
    zip: IconDocumentZip,
    log: IconDocumentText,
    default: IconDocument,
    // Add more mappings here for other file types
};

const unloadPlugin = (): void => {
    defaultDispatcher.dispatch({ action: PluginActions.UnloadPlugin });
};

const prettyFileSize = (bytes: number): string => {
    // Define the thresholds for each unit
    const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let size = bytes;
    let unitIndex = 0;

    // Determine the appropriate unit for the size
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    // Determine rounding based on unit
    let finalSize;
    if (unitIndex === 0 || unitIndex === 1) {
        // No decimal for Bytes and KB
        finalSize = Math.round(size);
    } else {
        // One decimal place for larger units, remove .0 if present
        const roundedSize = size.toFixed(1);
        finalSize = roundedSize.endsWith(".0") ? Math.round(size) : roundedSize;
    }

    return `${finalSize} ${units[unitIndex]}`;
};

function getIconComponent(fileName: string): React.ComponentType<React.ComponentProps<"svg">> | undefined {
    const extension = fileName.split(".").pop() ?? "";
    return iconMapping[extension.toLowerCase()];
}

const downloadFile = async (e: React.SyntheticEvent, file: File, currentUserId: string): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    if (file.mimetype==="application/pdf"){
        try {
            getFile(file.mediaId, currentUserId).then((blob)=>{
                const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
                window.open(url, '_blank');
                file.downloadUrl && URL.revokeObjectURL(file.downloadUrl);
            });
        } catch (err) {
            console.error('Unable to download file: ', err);
        }
    } else {
        try {
            const decryptedBlob = await getFile(file.mediaId, currentUserId);
            const fileDownloader = new FileDownloader();
            fileDownloader.download({
                blob: decryptedBlob,
                name: file.name,
                autoDownload: true,
            });
        } catch (err) {
            console.error('Unable to download file: ', err);
        }
    }
};

export interface FilesTableHandle {
    getSelectedFiles: () => File[];
}

export interface FilesTableProps {
    data: File[];
    rowSelection: RowSelectionState;
    setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
    mode: "dialog" | "standalone";
    onDelete?: (currentFile: any) => void;
}

export const FilesTable = React.forwardRef<FilesTableHandle, FilesTableProps>(
    ({ data, rowSelection, setRowSelection, mode, onDelete }, ref): JSX.Element => {
        const [sorting, setSorting] = React.useState<SortingState>([]);
        const [dialogOpen, setDialogOpen] = React.useState(false);
        const [showDelete, setShowDelete] = React.useState(true);
        const client = useMatrixClientContext();

        const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

        React.useEffect(() => {
            let temp = true;
            for (const key in rowSelection) {
                if (data[Number(key)].sender !== client.getUserId()) {
                    temp = false;
                    setShowDelete(false);
                }
            }
            if (temp) {
                setShowDelete(true);
            }
        }, [client, data, rowSelection]);
        const handleDialogOpenChange = async (open: boolean): Promise<void> => {
            if (open) {
                setDialogOpen(open);
            } else {
                setDialogOpen(false);
            }
        };
        const columns: ColumnDef<File>[] = [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="translate-y-[2px] mx-2"
                        hidden={data.length>5&&!onDelete}
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {if(onDelete){row.toggleSelected(!!value)}
                    else{
                        const selectedCount = Object.keys(rowSelection).length;
                        if (value && selectedCount < 5) {
                            row.toggleSelected(true);
                        }
                        else if(!value){
                            row.toggleSelected(false);
                        }else if (value && selectedCount === 5) {
                            // toast.info('You can only select up to 5 files at a time');
                            alert('You can only select up to 5 files at a time')
                        }
                    }}}
                        aria-label="Select row"
                        className="translate-y-[8px] mx-2"
                    />
                ),
                meta: {
                    filterVariant: null,
                },
                enableSorting: false,
                enableHiding: false,
                enableColumnFilter: false,
            },
            {
                accessorKey: "name",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
                cell: ({ row }): JSX.Element => {
                    const file = row.original;
                    const IconComponent = getIconComponent(file.name);
                    return (
                        <Button
                            onClick={(e) => {
                                downloadFile(e, file, client.getUserId());

                            }}
                            variant="ghost"
                            size="sm"
                            className="py-1 px-0 h-full w-auto"
                        >
                            {IconComponent ? (
                                <IconComponent className="h-4 w-4 mr-2" />
                            ) : (
                                <IconDocument className="h-4 w-4 mr-2" />
                            )}
                            <span className="max-w-[250px] truncate font-medium">{row.getValue("name")}</span>
                        </Button>
                    );
                },
                meta: {
                    filterVariant: 'select',
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "sender",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Sender" />,
                cell: ({ row }): JSX.Element => {
                    const sender = row.getValue("sender") as string;

                    return (
                        <div className="flex w-[100px] items-center">
                            <span>
                                {sender === client.getSafeUserId()
                                    ? "me"
                                    : client.getUser(sender)?.displayName ?? "Unknown"}
                            </span>
                        </div>
                    );
                },
                filterFn: (row, id, value): boolean => {
                    return value.includes(row.getValue(id));
                },
                meta: {
                    filterVariant: 'select',
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "roomId",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Room" />,
                cell: ({ row }): JSX.Element => {
                    const file = row.original;
                    const room = file.roomId ? client.getRoom(file.roomId) : null;

                    return (
                        <div className="flex items-center">
                            {room ? (
                                <Button
                                    className="w-auto h-auto p-0"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        unloadPlugin();
                                        window.location.hash = `#/room/${room.roomId}`;
                                    }}
                                >
                                    {room.name}
                                    <Icon name="ExternalLink" className="h-3 w-3 ml-1" />
                                </Button>
                            ) : (
                                <span>Unknown</span>
                            )}
                        </div>
                    );
                },
                meta: {
                    filterVariant: 'select',
                },
                filterFn: (row, id, value): boolean => {
                    return value.includes(row.getValue(id));
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "timestamp",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Shared on" />,
                cell: ({ row }): JSX.Element => {
                    const date: Date = row.getValue("timestamp");
                    const formatted = isToday(date) ? format(date, "h:mm a") : format(date, "MMM d, yyyy");

                    return <span>{formatted}</span>;
                },
                meta: {
                    filterVariant: null,
                },
                enableColumnFilter: false,
            },
            {
                accessorKey: "fileSize",
                header: ({ column }) => <DataTableColumnHeader column={column} title="File size" />,
                cell: ({ row }): JSX.Element => {
                    const fileSize = row.getValue("fileSize") as number;
                    return <span>{fileSize ? prettyFileSize(fileSize) : "—"}</span>;
                },
                meta: {
                    filterVariant: null,
                },
                enableColumnFilter: false,
            },
            {
                id: "actions",
                cell: ({ row }) => (
                    <DataTableRowActions row={row} onDelete={onDelete} mode={mode} userId={client.getUserId()!} setRowSelection={setRowSelection} />
                ),
                meta: {
                    filterVariant: null,
                },
                enableColumnFilter: false,
            },
        ];

        const table = useReactTable({
            data,
            columns,
            state: {
                sorting,
                rowSelection,
                columnFilters,
            },
            enableRowSelection: true,
            onRowSelectionChange: setRowSelection,
            onSortingChange: setSorting,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getFacetedRowModel: getFacetedRowModel(),
            getFacetedUniqueValues: getFacetedUniqueValues(),
            getFacetedMinMaxValues: getFacetedMinMaxValues(),
            onColumnFiltersChange: setColumnFilters,
        });

        React.useImperativeHandle(ref, () => ({
            getSelectedFiles(): File[] {
                return table.getSelectedRowModel().rows.map((row) => row.original) || [];
            },
        }));

        const deleteMultiFiles = (): void => {
            for (const key in rowSelection) {
                onDelete && onDelete(data[Number(key)]);
                setDialogOpen(false);
            }
            onDelete && setRowSelection({});
        };
        return (
            <>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <DataTableToolbar table={table} />
                        {onDelete && showDelete && Object.keys(rowSelection).length !== 0 && (
                            <Button variant="destructive" onClick={() => setDialogOpen(true)}>
                                <Icon name="Trash2" className="w-5 h-5" strokeWidth={2} />
                            </Button>
                        )}
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    <div className="flex">
                                                        {header.isPlaceholder
                                                            ? null
                                                            : <div className="w-full text-xs">
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext(),
                                                                )}
                                                            </div>                }
                                                        {header.column.getCanFilter() ? (
                                                            <Filter title={header.column.columnDef.accessorKey} column={header.column} />
                                                        ) : null}
                                                    </div>
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
                    <DataTablePagination table={table} />
                </div>
                <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you sure you want to delete all files?</DialogTitle>
                            <DialogDescription>
                                The action will delete files permanently, messages will be unrecoverable.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => setDialogOpen(false)}>cancel</Button>
                            <Button onClick={() => deleteMultiFiles()}>confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        );
    },
);
