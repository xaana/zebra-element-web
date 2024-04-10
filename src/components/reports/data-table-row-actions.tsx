import React, { useEffect, useState } from "react";
// import { Row } from "@tanstack/react-table";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";
import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import { Alignment } from "matrix-react-sdk/src/components/views/elements/Tooltip";
import { useSetAtom } from "jotai";

import { Icon } from "../ui/Icon";
import { IconPdfDoc, IconWordDoc } from "../ui/icons";
import { Report } from "./ReportsManager";
import { steps } from "./Home";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { reportsStore } from "@/plugins/reports/MainPanel";
import { editorStateAtom, apiUrlAtom, showHomeAtom, activeStepAtom } from "@/plugins/reports/stores/store";
import { getVectorConfig } from "@/vector/getconfig";
import toast from "react-hot-toast";


export function DataTableRowActions({ row }: { row: Report }): JSX.Element {
    const setEditorContent = useSetAtom(editorStateAtom);
    const setShowHome = useSetAtom(showHomeAtom);
    const setActiveStep = useSetAtom(activeStepAtom);
    const [spacePopoverOpen, setSpacePopoverOpen] = useState(false);
    // const [botApi,setBotApi] = useState("")
    const cli = MatrixClientPeg.safeGet();
    const handleEditReport = async (): Promise<void> => {
        const documentId = row.id;
        if (!documentId) return;
        try {
            const response = await fetch(`${reportsStore.get(apiUrlAtom)}/api/template/get_document`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ document_id: documentId }),
            });
            const data = await response.json();
            if (data?.document) {
                setEditorContent(() => JSON.parse(data.document));
                setActiveStep(() => steps[1]);
                setShowHome(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    // useEffect(() => {

    //     const getBotApi = async (): Promise<void> => {
    //         const configData = await getVectorConfig();
    //         if (configData?.bot_api) {
    //             setBotApi(configData?.bot_api);
    //         }
    //     };

    //     getBotApi();

    //     // // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    //     // fetch(`http://localhost:29316/_matrix/maubot/plugin/1/database_list`, {
    //     //     method: "GET",
    //     // }).then((response) => {
    //     //     response.json().then((data) => {
    //     //         setDbList(data);
    //     //     });
    //     // });
    // }, []);
    return (
        <div className="flex items-center justify-end gap-4">
            {/* <AccessibleTooltipButton className="p-2" title="Edit" alignment={Alignment.Top} onClick={handleEditReport}>
                <Icon name="Pencil" className="w-4 h-4" />
            </AccessibleTooltipButton> */}
            <Popover open={spacePopoverOpen} onOpenChange={setSpacePopoverOpen}>
                <PopoverTrigger
                    asChild
                >
                     <AccessibleTooltipButton 
            className="p-2" 
            title="Submit for approval" 
            alignment={Alignment.Top} 
            onClick={() => {
            }}>
                <Icon name="MessageSquareShare" className="w-4 h-4" />
            </AccessibleTooltipButton>
                </PopoverTrigger>
                <PopoverContent className="!p-1" side="top" align="start" sideOffset={6}>
                    <Command>
                        <CommandInput placeholder="Search by user ID..." className="text-xs" />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {["@zebra_admin:securezebra.com","@test:securezebra.com","@Matt:securezebra.com","@ROB:securezebra.com","@SONIA:securezebra.com"].filter(item => item !== cli.getSafeUserId()).map((userId, index) => (
                                    <CommandItem
                                        className="text-xs"
                                        key={index}
                                        value={userId}
                                        onSelect={() => {
                                            // setSelectedDb(() => dbList[index])
                                            setSpacePopoverOpen(false);
                                            const payload = {
                                                "user_id": cli.getUserId(),
                                                "receiver_id": userId,
                                                "request_data":{"filename":row.title,"note":"This report is just one testing"},
                                                "request_status":"Pending"
                                            }
                                            const headers = {
                                                "Content-Type": "application/json",
                                            }
                                            const request = new Request(`${reportsStore.get(apiUrlAtom)}/api/approval/send_request_message`, {
                                                method: "POST",
                                                body: JSON.stringify(payload),
                                                headers: headers
                                            });
                                            fetch(request);
                                            toast.success("Report sent successfully");
                                        
                                        }}
                                    >
                                        {userId}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <AccessibleTooltipButton
                className="p-2"
                title="Duplicate"
                alignment={Alignment.Top}
                onClick={handleEditReport}
            >
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
