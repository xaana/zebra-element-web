import React, { useEffect, useState } from "react";
import { FileDownloader } from "matrix-react-sdk/src/utils/FileDownloader";
import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import { toast } from "sonner";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { ShareReport } from "../ShareReport";
import { RadioGroup, RadioGroupItem } from "../../ui/RadioGroup";

import { IconDocumentPDF, IconDocumentText, IconDocumentWord } from "@/components/ui/icons";
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
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Report } from "@/plugins/reports/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ReportActions({
    row,
    onRename,
    onDuplicate,
    onDelete,
    allUsers,
}: {
    row: Report;
    onRename: (reportId: string, newName: string) => Promise<boolean>;
    onDuplicate: (reportId: string) => Promise<void>;
    onDelete: (reportId: string) => Promise<void>;
    allUsers: string[];
}): JSX.Element {
    const cli = MatrixClientPeg.safeGet();
    const [renameOpen, setRenameOpen] = useState(false);
    const [dropdownOpen, setDropDownOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    const downloadFile = async (asType: "docx" | "doc" | "pdf"): Promise<void> => {
        try {
            const documentId = row.id;
            const response = await fetch(
                `${SettingsStore.getValue("reportsApiUrl")}/api/reports/download_document/${documentId}/${asType}`,
            );

            if (!response.ok) {
                throw new Error("Download failed");
            }

            const blob = await response.blob();
            // fileDownload(blob, row.name + ".docx");
            const fileDownloader = new FileDownloader();
            blob &&
                fileDownloader.download({
                    blob,
                    name: row.name ? row.name + `.${asType}` : `Report.${asType}`,
                    autoDownload: true,
                });
        } catch (error) {
            console.error("Error downloading file:", error);
            // Handle error (e.g., show an error message to the user)
        }
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
                toast.success("Report sent successfully", { closeButton: true });
                setDropDownOpen(false);
            } else if (response.status === 403) {
                toast.error(`Unable to send for approval. Please try again later.`, { closeButton: true });
                setDropDownOpen(false);
            }
        } catch (error) {
            toast.error("Unable to send for approval. Please try again later.", { closeButton: true });
            console.error("Error fetching data:", error);
            setDropDownOpen(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-4" onClick={stopPropagation}>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropDownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-auto w-auto p-1 data-[state=open]:bg-muted rounded-full focus-visible:ring-0"
                    >
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
                            setDropDownOpen(false);
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
                            setDropDownOpen(false);
                            await handleDuplicate();
                        }}
                    >
                        Duplicate
                        <DropdownMenuShortcut>
                            <Icon name="Copy" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Download</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem
                                    onSelect={async (e: any) => {
                                        stopPropagation(e);
                                        setDropDownOpen(false);
                                        await downloadFile("docx");
                                    }}
                                >
                                    Word Document (.docx)
                                    <DropdownMenuShortcut>
                                        <IconDocumentWord className="w-4 h-4 ml-1" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={async (e: any) => {
                                        stopPropagation(e);
                                        setDropDownOpen(false);
                                        await downloadFile("doc");
                                    }}
                                >
                                    Word 2003 Document (.doc)
                                    <DropdownMenuShortcut>
                                        <IconDocumentText className="w-4 h-4 ml-1" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={async (e: any) => {
                                        stopPropagation(e);
                                        setDropDownOpen(false);
                                        await downloadFile("pdf");
                                    }}
                                >
                                    PDF Document (.pdf)
                                    <DropdownMenuShortcut>
                                        <IconDocumentPDF className="w-4 h-4 ml-1" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={async (e: any) => {
                            stopPropagation(e);
                            setDropDownOpen(false);
                            setShareDialogOpen(true);
                        }}
                    >
                        Share
                        <DropdownMenuShortcut>
                            <Icon name="LockKeyholeOpen" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={async (e: any) => {
                            stopPropagation(e);
                            setDropDownOpen(false);
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
                            setDropDownOpen(false);
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
                        {allUsers
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
            <ShareReport report={row} open={shareDialogOpen} setOpen={setShareDialogOpen} allUsers={allUsers} />
        </div>
    );
}

interface CreateOrRenameDialogProps {
    mode: "create" | "rename";
    open: boolean;
    setOpen: (open: boolean) => void;
    oldName?: string;
    onCancel?: () => void;
    onSubmit: (newname: string, fileType?: string) => Promise<any>;
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
    const [fileType, setFileType] = useState<"docx" | "xlsx">("docx");

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
            if (mode === "create") {
                await onSubmit(newName, fileType);
            } else {
                await onSubmit(newName);
            }
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
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center gap-4">
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

                    {mode === "create" && (
                        <div className="flex flex-row items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Type:
                            </Label>
                            <RadioGroup
                                defaultValue={fileType}
                                onValueChange={(value: string) => setFileType(value as "docx" | "xlsx")}
                                orientation="horizontal"
                                className="flex flex-row gap-4"
                            >
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="docx" id="r1" />
                                    <Label htmlFor="r1">Word</Label>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="xlsx" id="r2" />
                                    <Label htmlFor="r2">Spreadsheet</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}
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
