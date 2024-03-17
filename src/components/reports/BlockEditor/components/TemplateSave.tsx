import React from "react";
import { useEffect, useState } from "react";

import type { Editor } from "@tiptap/core";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button-alt";
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
import { Textarea } from "@/components/ui/textarea-alt";
import { RingLoader } from "@/components/ui/loaders/ring-loader";

export function TemplateSave({ editor }: { editor: Editor }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [saveResult, setSaveResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        if (!dialogOpen) {
            setSaveResult("");
            setName("");
            setDescription("");
        }
    }, [dialogOpen]);

    const handleSubmit = async () => {
        setLoading(true);
        const response = await fetch("http://localhost:8001/api/template", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                description: description.substring(0, 300),
                content: JSON.stringify(editor.getJSON()),
            }),
        });
        if (response.ok) {
            setName("");
            setLoading(false);
        } else {
            setSaveResult("Failed to save template. Please try again later.");
            setLoading(false);
        }
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Save Template
                    <Icon name="Save" className="ml-2 h-4 w-4" />
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
                            <DialogTitle>Save Template</DialogTitle>
                            <DialogDescription>Save the current editor state as a template.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    className="col-span-3"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Textarea
                                    className="col-span-3"
                                    placeholder="Type your description here."
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button disabled={name.length < 3} type="submit" onClick={handleSubmit}>
                                Save Template
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
