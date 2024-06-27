import React from "react";
import { RowSelectionState } from "@tanstack/react-table";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
const FilesTabs = ({
    displayType,
    setDisplayType,
    className,
    setRowSelection,
}: {
    displayType: "documents" | "media";
    setDisplayType: (value: "documents" | "media") => void;
    className?: string;
    setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}): JSX.Element => {
    return (
        <Tabs
            value={displayType}
            onValueChange={(value) => setDisplayType(value as "documents" | "media")}
            className={cn("w-full", className)}
        >
            <TabsList className="w-full">
                <TabsTrigger value="documents" className="flex-1">
                    <Icon className="mr-2" name="Files" />
                    Documents
                </TabsTrigger>
                <TabsTrigger value="media" className="flex-1" onClick={() => setRowSelection && setRowSelection({})}>
                    <Icon className="mr-2" name="Images" />
                    Media
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export default FilesTabs;
