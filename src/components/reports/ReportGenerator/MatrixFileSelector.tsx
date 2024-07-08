import React from "react";
import { useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import type { MatrixFile } from "@/plugins/files/types";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FilesTable } from "@/components/files/FilesTable";
import { dtoToFileAdapters, listFiles } from "@/components/files/FileOpsHandler";

export const MatrixFileSelector = ({
    setSelectedFiles,
    triggerContent,
}: {
    setSelectedFiles: React.Dispatch<React.SetStateAction<MatrixFile[]>>;
    triggerContent?: React.ReactNode;
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

    const handleDoneClick = async (): Promise<void> => {
        handleDialogToggle(false);
        const rowIndices = Object.keys(rowSelection);
        if (rowIndices.length > 0) {
            setSelectedFiles(
                () =>
                    rowIndices
                        .map((index) => documents[parseInt(index)])
                        .filter((matrixFile) =>
                            [
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                "application/pdf",
                                "application/msword",
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "application/vnd.ms-excel",

                            ].includes(matrixFile.mimetype ?? ""),
                        )
                        .slice(0, 5), // This slices the number of files to a maximum of 5,
            );
        }
    };

    return (
        <div>
            <Dialog open={filesDialogOpen} onOpenChange={handleDialogToggle}>
                <DialogTrigger asChild onClick={() => setFilesDialogOpen(true)}>
                    {triggerContent ? (
                        triggerContent
                    ) : (
                        <Button variant="outline" size="sm" className="font-semibold text-sm">
                            <Icon name="FileInput" className="mr-2" />
                            Select Documents
                        </Button>
                    )}
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
                        <div className="absolute bottom-0 inset-x-0 flex p-2 border-t items-center bg-background z-[1] justify-end">
                            <Button
                                type="button"
                                variant="default"
                                // size="sm"
                                className="mb-0.5"
                                disabled={Object.keys(rowSelection).length == 0}
                                onClick={async (e) => {
                                    e.preventDefault(); // Prevent any default action
                                    await handleDoneClick();
                                }}
                            >
                                Select
                                <Icon name="ArrowBigRightDash" className="ml-1" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
