import React, { useEffect, useState } from "react";
import { FileDownloader } from "matrix-react-sdk/src/utils/FileDownloader";
import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import { toast } from "sonner";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Report } from "@/plugins/reports/types";
import { generatePdf } from "@/plugins/reports/utils/generatePdf";
import { getReportContent } from "@/plugins/reports/utils/getReportContent";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ReportActions({
    row,
    onRename,
    onDuplicate,
    onDelete,
}: {
    row: Report;
    onRename: (reportId: string, newName: string) => Promise<boolean>;
    onDuplicate: (reportId: string) => Promise<void>;
    onDelete: (reportId: string) => Promise<void>;
}): JSX.Element {
    const cli = MatrixClientPeg.safeGet();
    const [userIds, setUserIds] = useState<string[]>([]);
    const [renameOpen, setRenameOpen] = useState(false);
    const [dropdownOpen, setDropDownOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);

    useEffect(() => {
        const url = `${SettingsStore.getValue("reportsApiUrl")}/api/get_users`;
        const request = new Request(url, {
            method: "GET",
        });
        fetch(request)
            .then((response) => response.json())
            .then((data) => {
                data.user && setUserIds(data.user.filter((item: string) => item !== "@zebra:securezebra.com"));
            });
    }, []);

    const downloadFile = async (): Promise<void> => {
        const documentInfo = await getReportContent(row.id);
        const { document_html: documentHtml, document_name: documentName } = documentInfo;

        if (!documentHtml) {
            toast.error("Failed to download the report");
            return;
        }

        const pdfBlob = await generatePdf(documentHtml);

        const fileDownloader = new FileDownloader();
        pdfBlob &&
            fileDownloader.download({
                blob: pdfBlob,
                name: documentName ? documentName + ".pdf" : row.name + ".pdf",
                autoDownload: true,
            });
    };

    const deleteFile = async (): Promise<void> => {
        await onDelete(row.id);
    };

    const stopPropagation = (e: any): void => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDuplicate = async (): Promise<void> => {
        await onDuplicate(row.id);
    };

    const handleApproval = async (userId: string): Promise<void> => {
        setApproveDialogOpen(false);
        setDropDownOpen(false);
        try {
            const response = await fetch(`${SettingsStore.getValue("workflowUrl")}/webhook/approval`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: cli.getUserId(),
                    receiver_id: userId,
                    request_data: {
                        filename: row.name,
                        fileId: row.id,
                        note: "Sent for approval",
                    },
                    request_status: "Submitted",
                }),
            });

            if (response.status === 200) {
                toast.success("Report sent successfully");
            } else if (response.status === 403) {
                toast.error(`Unable to send for approval. Please try again later.`);
            }
        } catch (error) {
            toast.error("Unable to send for approval. Please try again later.");
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="flex items-center justify-end gap-4" onClick={stopPropagation}>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropDownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-auto w-auto p-1 data-[state=open]:bg-muted rounded-full">
                        {/* <IconEllipses className="w-6 h-6 text-muted-foreground" /> */}
                        <Icon name="Ellipsis" className="w-4 h-4 text-muted-foreground" strokeWidth={1} />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={async (e: any) => {
                            stopPropagation(e);
                            setRenameOpen(true);
                        }}
                    >
                        Rename
                        <DropdownMenuShortcut>
                            <Icon name="PenLine" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={async (e: any) => {
                            stopPropagation(e);
                            await handleDuplicate();
                        }}
                    >
                        Duplicate
                        <DropdownMenuShortcut>
                            <Icon name="Copy" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={async (e: any) => {
                            stopPropagation(e);
                            await downloadFile();
                        }}
                    >
                        Download
                        <DropdownMenuShortcut>
                            <Icon name="ArrowDownToLine" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={async (e: any) => {
                            stopPropagation(e);
                            setApproveDialogOpen(true);
                        }}
                    >
                        Approval
                        <DropdownMenuShortcut>
                            <Icon name="MessageSquareShare" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-red-600"
                        onSelect={async (e: any) => {
                            stopPropagation(e);
                            await deleteFile();
                        }}
                    >
                        Delete
                        <DropdownMenuShortcut>
                            <Icon name="Trash2" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <CommandDialog className="w-[512px]" open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                <CommandInput placeholder="Search for user..." />
                <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup heading="Users">
                        {userIds
                            .filter((item) => item !== cli.getSafeUserId())
                            .map((userId, index) => (
                                <CommandItem
                                    className="cursor-pointer"
                                    key={index}
                                    onSelect={async () => await handleApproval(userId)}
                                >
                                    <Icon name="CircleUser" className="mr-2 h-4 w-4" />
                                    <span>{userId.split(":")[0].substring(1)}</span>
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            <CreateOrRenameDialog
                mode="rename"
                open={renameOpen}
                setOpen={setRenameOpen}
                oldName={row.name}
                onSubmit={(newName: string) => onRename(row.id, newName)}
            />
        </div>
    );
}

interface CreateOrRenameDialogProps {
    mode: "create" | "rename";
    open: boolean;
    setOpen: (open: boolean) => void;
    oldName?: string;
    onCancel?: () => void;
    onSubmit: (newname: string) => Promise<any>;
}

// Used in report rename and create new report from blank
export const CreateOrRenameDialog: React.FC<CreateOrRenameDialogProps> = ({
    mode,
    open,
    setOpen,
    oldName,
    onCancel,
    onSubmit,
}) => {
    const [newName, setNewName] = useState(oldName || "");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!open) {
            setNewName(oldName || "");
            setMessage("");
            onCancel && onCancel();
        }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (): Promise<void> => {
        if (newName === "") {
            setMessage("Name field cannot be be empty");
        } else {
            setMessage("");
            setOpen(false);
            await onSubmit(newName);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px] min-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Create New" : "Rename"} Report</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Enter a name for your new report" : `Enter a new name for ${oldName}`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            {mode === "create" ? "Name:" : "Updated Name:"}
                        </Label>
                        <Input
                            // id="name"
                            autoComplete="off"
                            value={newName}
                            className="col-span-3"
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="flex items-center gap-2">
                    {message.length > 0 && <p className="text-red-500 text-xs leading-none">{message}</p>}
                    <Button type="submit" onClick={handleSubmit} disabled={newName === ""}>
                        {mode === "create" ? "Create" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
