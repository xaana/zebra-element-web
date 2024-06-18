import React, { useEffect, useRef, useState } from "react";
import { MsgType } from "matrix-js-sdk/src/matrix";
import { RowSelectionState } from "@tanstack/react-table";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { init as initRouting } from "../../vector/routing";
import type { File } from "./types";
import { MediaGrid } from "../../components/files/MediaGrid";

import { getUserFiles } from "@/lib/utils/getUserFiles";
import { FilesTable } from "@/components/files/FilesTable";
import FilesTabs from "@/components/files/FilesTabs";
import { deleteFiles, dtoToFileAdapters, listFiles } from "@/components/files/FileOpsHandler";

export const MainPanel = (): JSX.Element => {
    const client = useMatrixClientContext();
    const [media, setMedia] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [displayType, setDisplayType] = useState<"documents" | "media">("documents");
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const allFiles = useRef<File[]>([]);
    useEffect(() => {
        initRouting();

        const fetchFiles = async (): Promise<void> => {
            // const fetchedFiles = await getUserFiles(client);
            const fetchedFiles = (await listFiles(client.getUserId() ?? "", )).map(item=>dtoToFileAdapters(item, client.getUserId()))
            allFiles.current = fetchedFiles;
            setDocuments([...fetchedFiles.filter((f) => f.type === MsgType.File)]);
            setMedia([...fetchedFiles.filter((f) => f.type === MsgType.Image)]);
        };

        fetchFiles();
    }, [client]);

    // useEffect(() => {
    //     return () => {
    //         allFiles.current.forEach(async (file) => {
    //             // Asynchronous cleanup if necessary or synchronous access to URLs
    //             file.mediaHelper.destroy();
    //         });
    //     };
    // }, []);
    const onDelete = (currentFile:any):void=>{
        const roomId = currentFile.roomId;
        const event = currentFile.event;
        if (roomId && event) {
            const eventId = typeof currentFile.event === "string" ? currentFile.event: currentFile.event?.getId();
            eventId&&client.redactEvent(roomId, eventId,undefined,{reason: "Manually delete the file in file manager by user."});
        }
        deleteFiles(currentFile.mediaId, currentFile.sender)

        if (currentFile.type === MsgType.File){
            setDocuments((prev)=>prev.filter(item => item.mediaId !== currentFile.mediaId))
        }else if (currentFile.type === MsgType.Image){
            setMedia((prev)=>prev.filter(item => item.mediaId !== currentFile.mediaId))
        }
    }

    return (
        <div className="h-full w-full flex justify-center py-6 px-3 overflow-y-auto">
            <div className="flex-1 max-w-screen-lg">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight mb-1">File Manager</h2>
                    <p className="text-muted-foreground">
                        View and manage your files – Select files to be analyzed by Zebra.
                    </p>
                </div>
                <FilesTabs className="mt-8 mb-4" displayType={displayType} setDisplayType={setDisplayType} />
                {displayType === "documents" && (
                    <FilesTable
                        data={documents}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        mode="standalone"
                        onDelete={onDelete}
                    />
                )}
                <div style={{ display: displayType === "media" ? "block" : "none" }}>
                    <MediaGrid media={media} mode="standalone" onDelete={onDelete} />
                </div>
            </div>
        </div>
    );
};
