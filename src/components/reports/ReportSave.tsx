import React from "react";
import { useEffect, useState } from "react";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import toast from "react-hot-toast";

import type { Editor } from "@tiptap/core";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { apiUrlAtom } from "@/plugins/reports/stores/store";
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
import { Label } from "@/components/ui/label";
import { RingLoader } from "@/components/ui/loaders/ring-loader";
import { reportsStore } from "@/plugins/reports/MainPanel";

export function ReportSave({ editor }: { editor: Editor }): JSX.Element {
    const [name, setName] = useState("");
    const [saveResult, setSaveResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const client = useMatrixClientContext();
    const userId: string = client.getSafeUserId();

    useEffect(() => {
        if (!dialogOpen) {
            setSaveResult("");
            setName("");
        }
    }, [dialogOpen]);

    const handleSubmit = async (): Promise<void> => {
        setLoading(true);
        const response = await fetch(`${reportsStore.get(apiUrlAtom)}/api/template/create_document`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userId,
                document_name: name,
                document_data: JSON.stringify(editor.getJSON()),
            }),
        });
        if (response.ok) {
            setName("");
            setLoading(false);
            setDialogOpen(false);
            toast.success("Report saved successfully!");
        } else {
            setSaveResult("Failed to save template. Please try again later.");
            setLoading(false);
        }
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
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
                        <div className="grid gap-4 py-4">
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
