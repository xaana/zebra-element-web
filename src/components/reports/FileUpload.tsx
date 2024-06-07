import React, { useContext, useEffect, useRef } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { Editor } from "@tiptap/react";
import { RowSelectionState } from "@tanstack/react-table";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { MsgType } from "matrix-js-sdk/src/matrix";
import { toast } from "sonner";

import type { File as MatrixFile } from "@/plugins/files/types";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FilesTable } from "@/components/files/FilesTable";
import { getUserFiles } from "@/lib/utils/getUserFiles";
import { EditorContext } from "@/plugins/reports/context/EditorContext";

export const FileUpload = ({ editor, nextStep }: { editor: Editor; nextStep: () => void }): JSX.Element => {
    // const [files, setFiles] = useState<FileList | null>(null);
    const [errors, setErrors] = useState<z.ZodIssue[]>([]);
    const [documents, setDocuments] = useState<MatrixFile[]>([]);
    const { setIsAiLoading } = useContext(EditorContext);
    const [filesDialogOpen, setFilesDialogOpen] = useState(false);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const client = useMatrixClientContext();
    const inputRef = useRef<HTMLInputElement>(null);

    const MAX_FILE_SIZE = 500; // in MB

    const fileUploadFormSchema = z.object({
        files: z
            .any()
            .refine((data: unknown) => data instanceof FileList && data.length > 0, {
                message: "At least one file is required",
                path: [],
            })
            .refine(
                (data: FileList) => {
                    for (let i = 0; i < data.length; i++) {
                        const fileExtension = data.item(i)?.name.split(".").pop();
                        if (fileExtension?.toLowerCase() !== "pdf") {
                            return false;
                        }
                    }
                    return true;
                },
                { message: "All files should be in .pdf format" },
            )
            .refine(
                (data: FileList) => {
                    for (let i = 0; i < data.length; i++) {
                        const fileSize = data.item(i)?.size;
                        if (fileSize === undefined || fileSize > MAX_FILE_SIZE * 1024 * 1024) return false;
                    }
                    return true;
                },
                {
                    message: `File size of all files should be no more than ${MAX_FILE_SIZE}MB`,
                },
            ),
    });

    const fileUploadForm = useForm<z.infer<typeof fileUploadFormSchema>>({
        defaultValues: {
            files: null,
        },
    });

    const onFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const fileInput = e.target.files;
        if (!fileInput) {
            console.warn("No files selected.");
            return; // Exit early if no files are selected.
        }
        // setFiles(fileInput);
        const validationResult = fileUploadFormSchema.safeParse({
            files: fileInput,
        });
        if (!validationResult.success) {
            setErrors(validationResult.error.errors);
            validationResult.error.errors.forEach((error) =>
                fileUploadForm.setError("files", { type: "manual", message: error.message }),
            );
        } else {
            setErrors([]);
            fileUploadForm.clearErrors("files");
            await generateContentFromFile(fileInput[0]);
        }
    };

    const generateContentFromFile = async (file: File): Promise<void> => {
        const formData = new FormData();
        formData.append("files", file);

        setIsAiLoading(true);
        nextStep();

        try {
            // Make API request
            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/extract/pdf`, {
                method: "POST",
                body: formData,
            });
            const responseData = await response.json();

            if (responseData?.html_pages?.length > 0) {
                const combinedString = responseData.html_pages.join("\n");
                editor.commands.setContent(combinedString);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleDialogToggle = async (open: boolean): Promise<void> => {
        if (open) {
            const fetchedFiles = await getUserFiles(client);
            setDocuments([...fetchedFiles.filter((f) => f.type === MsgType.File)]);
        } else {
            setFilesDialogOpen(false);
            setRowSelection({});
        }
    };

    const uploadFile = async (matrixFile: MatrixFile): Promise<void> => {
        if (matrixFile.mimetype !== "application/pdf") {
            toast.error("Only PDF files supported.");
            return;
        }
        const fileBlob = await matrixFile.mediaHelper.sourceBlob.value;
        const file = new File([fileBlob], matrixFile.name, { type: "application/pdf" });
        await generateContentFromFile(file);
    };

    useEffect(() => {
        if (Object.keys(rowSelection).length == 1) {
            uploadFile(documents[parseInt(Object.keys(rowSelection)[0])]);
            handleDialogToggle(false);
        }
    }, [rowSelection]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <Dialog open={filesDialogOpen} onOpenChange={handleDialogToggle}>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="font-semibold text-sm"
                        onClick={() => setFilesDialogOpen(true)}
                    >
                        <Icon name="Import" className="mr-2" />
                        Import from file
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[70vw] max-w-[70vw] h-[70vh] p-0 overflow-hidden">
                    <div className="relative w-[70vw] max-w-[70vw] h-[70vh] p-4">
                        <h2 className="text-2xl font-semibold tracking-tight mt-1 mb-4">Select Files</h2>
                        <FilesTable
                            data={documents}
                            rowSelection={rowSelection}
                            setRowSelection={setRowSelection}
                            mode="dialog"
                        />

                        <div className="absolute bottom-0 inset-x-0 flex p-2 border-t items-center bg-background z-[1] justify-end">
                            <Form {...fileUploadForm}>
                                <form className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        // multiple
                                        onChange={onFileChange}
                                        accept="application/pdf" // Restrict file type to PDF
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-2">
                                        {errors.map((error: z.ZodIssue, index) => (
                                            <p key={index} className="text-center text-xs font-normal text-red-500">
                                                {error.message}
                                            </p>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mb-0.5"
                                        onClick={() => inputRef.current?.click()}
                                    >
                                        <Icon name="Upload" className="mr-2" />
                                        Upload File
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
