import React, { useEffect, useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import type { MatrixFile } from "@/plugins/files/types";

import { MediaGrid } from "@/components/files/MediaGrid";
import { init as initRouting } from "@/vector/routing";
import { FilesTable } from "@/components/files/FilesTable";
import FilesTabs from "@/components/files/FilesTabs";
import { deleteFiles, dtoToFileAdapters, listFiles } from "@/components/files/FileOpsHandler";
import { Loader } from "@/components/ui/LoaderAlt";

export const MainPanel = (): JSX.Element => {
    const client = useMatrixClientContext();
    const [media, setMedia] = useState<MatrixFile[]>([]);
    const [documents, setDocuments] = useState<MatrixFile[]>([]);
    const [displayType, setDisplayType] = useState<"documents" | "media">("documents");
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const fetchFiles = async (): Promise<void> => {
        const fetchedFiles = (await listFiles(client.getUserId() ?? "")).map((item) =>
            dtoToFileAdapters(item, client.getUserId()),
        );
        setDocuments([...fetchedFiles.filter((f) => f.mimetype && !f.mimetype.startsWith("image/"))]);
        setMedia([...fetchedFiles.filter((f) => f.mimetype && f.mimetype.startsWith("image/"))]);
    };

    useEffect(() => {
        initRouting();
        fetchFiles();
    }, [client]); // eslint-disable-line react-hooks/exhaustive-deps

    const onDelete = (currentFile: any): void => {
        const roomId = currentFile.roomId;
        const event = currentFile.event;
        if (roomId && event) {
            const eventId = typeof currentFile.event === "string" ? currentFile.event : currentFile.event?.getId();
            eventId &&
                client.redactEvent(roomId, eventId, undefined, {
                    reason: "File has been deleted by user.",
                });
        }
        deleteFiles(currentFile.mediaId, currentFile.sender);
        if (!currentFile.mimetype.startsWith("image/")) {
            setDocuments((prev) => prev?.filter((item) => item.mediaId !== currentFile.mediaId));
        } else if (currentFile.mimetype.startsWith("image/")) {
            setMedia((prev) => prev?.filter((item) => item.mediaId !== currentFile.mediaId));
        }
    };
    const onUpdate = (): void => {
        fetchFiles();
    };

    return (
        <div className="h-full w-full flex justify-center py-6 px-3 overflow-y-auto">
            <div className="flex-1 max-w-screen-lg">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight mb-1">File Manager</h2>
                    <p className="text-muted-foreground">View and manage your files</p>
                </div>
                <FilesTabs className="mt-8 mb-4" displayType={displayType} setDisplayType={setDisplayType} />
                {!documents ? (
                    <Loader />
                ) : (
                    <>
                        {displayType === "documents" && (
                            <FilesTable
                                data={documents}
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                                mode="standalone"
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                            />
                        )}
                        <div style={{ display: displayType === "media" ? "block" : "none" }}>
                            <MediaGrid media={media} mode="standalone" onDelete={onDelete} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
