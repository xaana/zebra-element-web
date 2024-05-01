import React, { useEffect, useState } from "react";
import { MsgType } from "matrix-js-sdk/src/matrix";

import { init as initRouting } from "../../vector/routing";
import { columns, DataTable } from "./DataTable";
import type { File } from "./types";
import { MediaGrid } from "./MediaGrid";

import { useFiles } from "@/lib/hooks/use-files";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@/components/ui/Icon";

export const MainPanel = (): JSX.Element => {
    const { getUserFiles } = useFiles();
    // const [files, setFiles] = useState<File[]>([]);
    const [media, setMedia] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [displayType, setDisplayType] = useState("media");

    useEffect(() => {
        initRouting();

        const fetchFiles = async (): Promise<void> => {
            const fetchedFiles = await getUserFiles();
            setDocuments([...fetchedFiles.filter((f) => f.type === MsgType.File)]);
            setMedia([...fetchedFiles.filter((f) => f.type === MsgType.Image)]);
        };

        fetchFiles();
    }, [getUserFiles]);

    useEffect(() => {});

    return (
        <div className="h-full w-full flex justify-center py-6 px-3 overflow-y-auto">
            <div className="flex-1 max-w-screen-lg">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">File Manager</h2>
                    <p className="text-muted-foreground text-sm">
                        View and manage your files – Select files to be analyzed by Zebra.
                    </p>
                </div>
                <Tabs value={displayType} onValueChange={(value) => setDisplayType(value)} className="mt-8">
                    <TabsList className="w-full">
                        <TabsTrigger value="documents" className="flex-1">
                            <Icon className="mr-2" name="Files" />
                            Documents
                        </TabsTrigger>
                        <TabsTrigger value="media" className="flex-1">
                            <Icon className="mr-2" name="Images" />
                            Media
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                {displayType === "documents" && <DataTable columns={columns} data={documents} />}
                <div style={{ display: displayType === "media" ? "block" : "none" }}>
                    <MediaGrid media={media} />
                </div>
            </div>
        </div>
    );
};
