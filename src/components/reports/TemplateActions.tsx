import React from "react";
import { useSetAtom } from "jotai";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { IconEllipses } from "@/components/ui/icons";
import { Icon } from "@/components/ui/Icon";
import { steps } from "@/plugins/reports/initialContent";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { editorStateAtom, showHomeAtom, activeStepAtom } from "@/plugins/reports/stores/store";
import { Template } from "@/plugins/reports/types";

export function TemplateActions({ row }: { row: Template }): JSX.Element {
    const setEditorContent = useSetAtom(editorStateAtom);
    const setShowHome = useSetAtom(showHomeAtom);
    const setActiveStep = useSetAtom(activeStepAtom);
    const handleEditReport = async (): Promise<void> => {
        const documentId = row.id;
        if (!documentId) return;
        try {
            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/template/get_document`, {
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted rounded-full">
                        <IconEllipses className="w-6 h-6 text-muted-foreground" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem onClick={handleEditReport}>
                        Duplicate
                        <DropdownMenuShortcut>
                            <Icon name="Copy" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Download
                        <DropdownMenuShortcut>
                            <Icon name="ArrowDownToLine" className="w-4 h-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
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
