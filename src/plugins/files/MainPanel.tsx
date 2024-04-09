import React, { useEffect, useState } from "react";

import { init as initRouting } from "../../vector/routing";
import { columns, DataTable } from "./DataTable";
import type { File } from "./types";

import { useFiles } from "@/lib/hooks/use-files";

export const MainPanel = (): JSX.Element => {
    const { getUserFiles } = useFiles();
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        initRouting();

        const fetchFiles = async (): Promise<void> => {
            const fetchedFiles = await getUserFiles();
            setFiles([...fetchedFiles]);
        };

        fetchFiles();
    }, [getUserFiles]);

    return (
        <div className="h-full w-full flex justify-center py-6 px-3 overflow-y-auto">
            <div className="flex-1 max-w-screen-lg">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">File Manager</h2>
                    <p className="text-muted-foreground text-sm">
                        View and manage your files – Select files to be analyzed by Zebra.
                    </p>
                </div>
                <DataTable columns={columns} data={files} />
            </div>
        </div>
    );
};
