import React, { useEffect, useState } from "react";
import { MsgType } from "matrix-js-sdk/src/matrix";
import { RowSelectionState } from "@tanstack/react-table";

import { init as initRouting } from "../../vector/routing";
// import { DataTable } from "./DataTable";
import type { File } from "./types";
import { MediaGrid } from "../../components/files/MediaGrid";

import { useFiles } from "@/lib/hooks/use-files";
import { FilesTable } from "@/components/files/FilesTable";
import FilesTabs from "@/components/files/FilesTabs";

export const MainPanel = (): JSX.Element => {
    const { getUserFiles } = useFiles();
    const [media, setMedia] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [displayType, setDisplayType] = useState<"documents" | "media">("documents");
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    useEffect(() => {
        initRouting();

        const fetchFiles = async (): Promise<void> => {
            const fetchedFiles = await getUserFiles();
            setDocuments([...fetchedFiles.filter((f) => f.type === MsgType.File)]);
            setMedia([...fetchedFiles.filter((f) => f.type === MsgType.Image)]);
        };

        fetchFiles();
    }, [getUserFiles]);

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
                    />
                )}
                <div style={{ display: displayType === "media" ? "block" : "none" }}>
                    <MediaGrid media={media} mode="standalone" />
                </div>
            </div>
        </div>
    );
};
