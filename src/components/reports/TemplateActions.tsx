import React, { useContext } from "react";
import { useSetAtom } from "jotai";
import { FileDownloader } from "matrix-react-sdk/src/utils/FileDownloader";

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
import { showHomeAtom, activeStepAtom } from "@/plugins/reports/stores/store";
import { Template } from "@/plugins/reports/types";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import { generatePdf } from "@/plugins/reports/utils/generatePdf";
import { getTemplateContent } from "@/plugins/reports/utils/getTemplateContent";

export function TemplateActions({ row }: { row: Template }): JSX.Element {
    const setShowHome = useSetAtom(showHomeAtom);
    const setActiveStep = useSetAtom(activeStepAtom);
    const { editor } = useContext(EditorContext);

    const downloadFile = async (): Promise<void> => {
        if (!editor) return;

        let templateContent: string | null = null;

        if (!row.content) {
            const templateContentString = await getTemplateContent(row.id);
            if (templateContentString) {
                templateContent = templateContentString;
            }
        } else {
            editor.commands.setContent(row.content);
            templateContent = editor.getHTML();
        }

        if (!templateContent) {
            return;
        }

        editor?.commands.setContent(templateContent);
        const pdfBlob = await generatePdf(editor.getHTML());

        const fileDownloader = new FileDownloader();
        pdfBlob &&
            fileDownloader.download({
                blob: pdfBlob,
                name: row.name + ".pdf",
                autoDownload: true,
            });
    };

    const handleEditReport = async (): Promise<void> => {
        if (Number(row.id) < 0) {
            row.content && editor?.commands.setContent(row.content);
            return;
        }
        try {
            const templateContentString = await getTemplateContent(row.id);
            if (templateContentString) {
                editor?.commands.setContent(JSON.parse(templateContentString));
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
                    <Button variant="ghost" className="flex h-auto w-auto p-1 data-[state=open]:bg-muted rounded-full">
                        {/* <IconEllipses className="w-6 h-6 text-muted-foreground" /> */}
                        <Icon name="Ellipsis" className="w-4 h-4 text-muted-foreground" strokeWidth={1} />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem className="cursor-pointer" onClick={handleEditReport}>
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
