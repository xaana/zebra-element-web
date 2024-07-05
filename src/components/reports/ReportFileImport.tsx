import React, { useEffect, useState } from "react";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { ChangeEvent, useRef } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { toast } from "sonner";

import type { MatrixFile } from "@/plugins/files/types";

import { MimeTypeToExtensionMapping } from "@/plugins/files/types";
import { dtoToFileAdapters, getFile, listFiles } from "@/components/files/FileOpsHandler";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FilesTable } from "@/components/files/FilesTable";

export const ReportFileImport = ({
    onFileUpload,
}: {
    onFileUpload: (fileBlob: File) => Promise<void>;
}): JSX.Element => {
    const [documents, setDocuments] = useState<MatrixFile[]>([]);
    const [filesDialogOpen, setFilesDialogOpen] = useState(false);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const client = useMatrixClientContext();

    const fetchFiles = async (): Promise<void> => {
        const fetchedFiles = (await listFiles(client.getUserId() ?? "")).map((item) =>
            dtoToFileAdapters(item, client.getUserId()),
        );
        setDocuments([...fetchedFiles.filter((f) => f.mimetype && !f.mimetype.startsWith("image/"))]);
    };

    const handleDialogToggle = async (open: boolean): Promise<void> => {
        if (open) {
            await fetchFiles();
        } else {
            setFilesDialogOpen(false);
            setRowSelection({});
        }
    };

    const handleUploadedFileSelection = async (matrixFile: MatrixFile): Promise<void> => {
        if (!matrixFile.mimetype || MimeTypeToExtensionMapping[matrixFile.mimetype] === undefined) {
            handleDialogToggle(false);
            setTimeout(() => {
                toast.error("Unsupported file type. Allowed types: PDF, DOC, DOCX, ODT, RTF, TXT, XLS, XLSX, ODS.");
            }, 300);
            return;
        }

        const fileBlob = await getFile(matrixFile.mediaId, client.getUserId() ?? "");
        const file = new File([fileBlob], matrixFile.name, { type: matrixFile.mimetype });
        handleDialogToggle(false);
        await onFileUpload(file);
    };

    useEffect(() => {
        if (Object.keys(rowSelection).length == 1) {
            handleUploadedFileSelection(documents[parseInt(Object.keys(rowSelection)[0])]);
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
                            onUpdate={async () => await fetchFiles()}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
