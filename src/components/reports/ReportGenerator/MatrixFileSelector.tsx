import React from "react";
import { useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { MsgType } from "matrix-js-sdk/src/matrix";

import type { MatrixFile } from "@/plugins/files/types";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FilesTable } from "@/components/files/FilesTable";
import { getUserFiles } from "@/lib/utils/getUserFiles";

export const MatrixFileSelector = ({
    contentFiles,
    setContentFiles,
}: {
    contentFiles: MatrixFile[];
    setContentFiles: React.Dispatch<React.SetStateAction<MatrixFile[]>>;
}): JSX.Element => {
    const [documents, setDocuments] = useState<MatrixFile[]>([]);
    const [filesDialogOpen, setFilesDialogOpen] = useState(false);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const client = useMatrixClientContext();

    const handleDialogToggle = async (open: boolean): Promise<void> => {
        if (open) {
            const fetchedFiles = await getUserFiles(client);
            setDocuments([...fetchedFiles.filter((f) => f.type === MsgType.File)]);
        } else {
            setFilesDialogOpen(false);
            setRowSelection({});
        }
    };

    const handleDoneClick = async (): Promise<void> => {
        handleDialogToggle(false);
        const rowIndices = Object.keys(rowSelection);
        if (rowIndices.length > 0) {
            setContentFiles(
                () =>
                    rowIndices
                        .map((index) => documents[parseInt(index)])
                        .filter((matrixFile) =>
                            [
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                "application/pdf",
                                "application/msword",
                            ].includes(matrixFile.mimetype ?? ""),
                        )
                        .slice(0, 5), // This slices the number of files to a maximum of 5,
            );
        }
    };

    return (
        <div>
            <Dialog open={filesDialogOpen} onOpenChange={handleDialogToggle}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-semibold text-sm"
                        onClick={() => setFilesDialogOpen(true)}
                    >
                        <Icon name="FileInput" className="mr-2" />
                        Select Documents
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
                            <Button
                                type="button"
                                variant="default"
                                size="sm"
                                className="mb-0.5"
                                disabled={Object.keys(rowSelection).length == 0}
                                onClick={async (e) => {
                                    e.preventDefault(); // Prevent any default action
                                    await handleDoneClick();
                                }}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
