import React from "react";
// import { Row } from "@tanstack/react-table";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";
import { Alignment } from "matrix-react-sdk/src/components/views/elements/Tooltip";
import { useSetAtom } from "jotai";

import { Icon } from "../ui/Icon";
import { IconPdfDoc, IconWordDoc } from "../ui/icons";
import { Report } from "./ReportsManager";
import { steps } from "./Home";

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

export function DataTableRowActions({ row }: { row: Report }): JSX.Element {
    const setEditorContent = useSetAtom(editorStateAtom);
    const setShowHome = useSetAtom(showHomeAtom);
    const setActiveStep = useSetAtom(activeStepAtom);

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

    return (
        <div className="flex items-center justify-end gap-4">
            {/* <AccessibleTooltipButton className="p-2" title="Edit" alignment={Alignment.Top} onClick={handleEditReport}>
                <Icon name="Pencil" className="w-4 h-4" />
            </AccessibleTooltipButton> */}
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
