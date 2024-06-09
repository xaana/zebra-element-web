import React, { useEffect, useState } from "react";
import { FileDownloader } from "matrix-react-sdk/src/utils/FileDownloader";
import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import { toast } from "sonner";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

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

export function ReportActions({
    row,
    onDuplicate,
}: {
    row: Report;
    onDuplicate: (reportId: string) => Promise<void>;
}): JSX.Element {
    const cli = MatrixClientPeg.safeGet();
    const [userIds, setUserIds] = useState<string[]>([]);
    const [spacePopoverOpen, setSpacePopoverOpen] = useState(false);
    // prevent trigger the parent root on click to view the template
    const handleClick = (event: any): void => {
        // Prevents the click event from bubbling up to parent elements
        event.stopPropagation();

        // Handle other actions specific to TemplateActions here
    };
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
        let htmlContent: string | undefined = undefined;

        if (!row.content) {
            htmlContent = (await getReportContent(row.id)) ?? undefined;
        }

        if (!htmlContent) {
            toast.error("Failed to download the report");
            return;
        }

        const pdfBlob = await generatePdf(htmlContent);

        const fileDownloader = new FileDownloader();
        pdfBlob &&
            fileDownloader.download({
                blob: pdfBlob,
                name: row.name + ".pdf",
                autoDownload: true,
            });
    };

    const handleDuplicate = async (): Promise<void> => {
        await onDuplicate(row.id);
    };

    const approveElement = (
        <Popover open={spacePopoverOpen}>
            <PopoverTrigger asChild={true}>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                        e.preventDefault();
                        setSpacePopoverOpen(true);
                    }}
                >
                    Approval
                    <DropdownMenuShortcut>
                        <Icon name="MessageSquareShare" className="w-4 h-4" />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                {/* <AccessibleTooltipButton 
    // className="p-2" 
    title="Submit for approval" 
    alignment={Alignment.Top} 
    onClick={() => {
    }}>
        
    </AccessibleTooltipButton> */}
            </PopoverTrigger>
            <PopoverContent
                className="!p-1"
                side="left"
                align="start"
                sideOffset={6}
                onPointerDownOutside={() => setSpacePopoverOpen(false)}
            >
                <Command>
                    <CommandInput placeholder="Search by user ID..." className="text-xs" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {userIds
                                .filter((item) => item !== cli.getSafeUserId())
                                .map((userId, index) => (
                                    <CommandItem
                                        className="text-xs"
                                        key={index}
                                        value={userId}
                                        onSelect={() => {
                                            // setSelectedDb(() => dbList[index])
                                            setSpacePopoverOpen(false);
                                            const payload = {
                                                user_id: cli.getUserId(),
                                                receiver_id: userId,
                                                request_data: {
                                                    filename: row.name,
                                                    note: "This report is just one testing",
                                                },
                                                request_status: "Pending",
                                            };
                                            const headers = {
                                                "Content-Type": "application/json",
                                            };
                                            const request = new Request(
                                                `${SettingsStore.getValue("workflowUrl")}/webhook/approval`,
                                                {
                                                    method: "POST",
                                                    body: JSON.stringify(payload),
                                                    headers: headers,
                                                },
                                            );
                                            fetch(request);
                                            toast.success("Report sent successfully");
                                        }}
                                    >
                                        {userId.split(":")[0].substring(1)}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );

    return (
        <div className="flex items-center justify-end gap-4" onClick={handleClick}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-auto w-auto p-1 data-[state=open]:bg-muted rounded-full">
                        {/* <IconEllipses className="w-6 h-6 text-muted-foreground" /> */}
                        <Icon name="Ellipsis" className="w-4 h-4 text-muted-foreground" strokeWidth={1} />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem className="cursor-pointer" onClick={handleDuplicate}>
                        Duplicate
                        <DropdownMenuShortcut>
                            <Icon name="Copy" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={async (e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            await downloadFile();
                        }}
                    >
                        Download
                        <DropdownMenuShortcut>
                            <Icon name="ArrowDownToLine" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {row.type === "report" && approveElement}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                        Delete
                        <DropdownMenuShortcut>
                            <Icon name="Trash2" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
