import React, { useState } from "react";
import { toast } from "sonner";

import type { Editor } from "@tiptap/react";

import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { generatePdf } from "@/plugins/reports/utils/generatePdf";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Tooltip from "@/components/ui/TooltipAlt";

interface ReportViewerProps {
    editor: Editor;
}
export const ReportViewer = ({ editor }: ReportViewerProps): JSX.Element => {
    const [pdfUrl, setPdfUrl] = useState("");
    const [isPdfLoading, setisPdfLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogToggle = (open: boolean): void => {
        if (open) {
            setDialogOpen(true);
            setisPdfLoading(true);
            generatePdf(editor.getHTML())
                .then((blob) => {
                    if (blob) {
                        const url = window.URL.createObjectURL(blob);
                        setPdfUrl(url); // Update state with the URL for the PDF
                    }
                })
                .catch((error) => {
                    toast.error("Error displaying PDF. Please try again later.");
                })
                .finally(() => {
                    setisPdfLoading(false);
                });
        } else {
            setDialogOpen(false);
            // Reset state
            setPdfUrl("");
            setisPdfLoading(false);
        }
    };

    return (
        <>
            <Dialog open={dialogOpen} onOpenChange={handleDialogToggle}>
                <DialogTrigger asChild>
                    <Tooltip title="Preview Report">
                        <Button
                            onClick={() => handleDialogToggle(true)}
                            variant="secondary"
                            className="font-semibold text-sm h-auto w-auto p-2"
                            size="sm"
                        >
                            <Icon name="Eye" />
                        </Button>
                    </Tooltip>
                </DialogTrigger>
                <DialogContent className="h-screen w-screen max-w-[100vw] bg-card p-0 overflow-hidden">
                    {isPdfLoading && (
                        <div className="w-full p-20 flex justify-center items-center">
                            <Loader height="50" width="50" />
                        </div>
                    )}
                    {pdfUrl.length > 0 && (
                        <div className="w-full h-full relative">
                            <iframe
                                className="absolute bottom-0 inset-x-0"
                                title="pdf"
                                src={pdfUrl}
                                width="100%"
                                style={{ height: "calc(100vh - 48px)" }}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
