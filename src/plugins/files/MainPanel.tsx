import React, { useEffect, useState } from "react";

import { columns, DataTable } from "./DataTable";
import { init as initRouting } from "../../vector/routing";
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
        <div>
            <DataTable columns={columns} data={files} />
        </div>
    );
};
