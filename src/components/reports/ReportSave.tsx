import React from "react";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { toast } from "sonner";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import type { Editor } from "@tiptap/react";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { showHomeAtom } from "@/plugins/reports/stores/store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RingLoader } from "@/components/ui/loaders/ring-loader";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { convertImageUrlToBase64 } from "@/plugins/reports/utils/generatePdf";

export function ReportSave({ editor }: { editor: Editor }): JSX.Element {
    const [name, setName] = useState("");
    const [type, setType] = useState<string>("report");
    const [saveResult, setSaveResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const setShowHome = useSetAtom(showHomeAtom);
    const client = useMatrixClientContext();

    useEffect(() => {
        if (!dialogOpen) {
            setSaveResult("");
            setName("");
        }
    }, [dialogOpen]);

    const handleSubmit = async (): Promise<void> => {
        setLoading(true);
        const parser = new DOMParser();
        const doc = parser.parseFromString(editor.getHTML(), "text/html");
        const images = doc.querySelectorAll("img");

        // Map each image to a promise
        const imagePromises = Array.from(images).map(async (img) => {
            const src = img.getAttribute("src");
            if (src?.startsWith("blob:")) {
                const base64: any = await convertImageUrlToBase64(src);
                img.src = base64.toString();
            } else if (src?.startsWith("/")) {
                const base64: any = await convertImageUrlToBase64(window.location.origin + src);
                img.src = base64.toString();
            }
        });

        // Wait for all promises to resolve
        await Promise.all(imagePromises);
        const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/template/create_document`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: client.getSafeUserId(),
                document_name: name,
                // document_data: JSON.stringify(editor.getJSON()),
                document_data: doc.body.innerHTML,
                document_type: type,
            }),
        });
        if (response.ok) {
            setName("");
            setLoading(false);
            setDialogOpen(false);
            toast.success("Report saved successfully!");
            setShowHome(true);
            editor.commands.setContent("");
        } else {
            setSaveResult("Failed to save template. Please try again later.");
            setLoading(false);
        }
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    Save Report
                    <Icon name="Save" strokeWidth={2} className="ml-1 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {saveResult ? (
                    <div className="w-full h-full flex justify-center items-center p-4">
                        <p className="text-red-500 text-sm">{saveResult}</p>
                    </div>
                ) : loading ? (
                    <div className="w-full h-full flex justify-center items-center p-4">
                        <RingLoader />
                    </div>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Save Report</DialogTitle>
                            <DialogDescription>Save the preview as a report document.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-2">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Report Name
                                </Label>
                                <Input
                                    id="name"
                                    className="col-span-3"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Save as
                                </Label>
                                <RadioGroup className="flex items-center gap-4" value={type} onValueChange={setType}>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="report" id="report" />
                                        <Label htmlFor="report">Report</Label>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="template" id="template" />
                                        <Label htmlFor="template">Template</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="default" disabled={name.length < 3} type="submit" onClick={handleSubmit}>
                                Save Report
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
