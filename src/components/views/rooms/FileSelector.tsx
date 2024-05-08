import React, { useContext, useEffect, useState } from "react";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";
import { MsgType } from "matrix-js-sdk/src/matrix";
import { RowSelectionState } from "@tanstack/react-table";

import { init as initRouting } from "../../../vector/routing";

import "./style/button.css";
import { File } from "@/plugins/files/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getUserFiles } from "@/lib/utils/getUserFiles";
import { FilesTable } from "@/components/files/FilesTable";
import FilesTabs from "@/components/files/FilesTabs";
import { MediaGrid, MediaItem } from "@/components/files/MediaGrid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IProps {
    roomId: string;
}

export interface DocFile {
    mediaId: string;
    name: string;
    eventId?: string;
    roomId: string;
}

export const FileSelector = (props: IProps): JSX.Element => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [media, setMedia] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const { timelineRenderingType } = useContext(RoomContext);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [displayType, setDisplayType] = useState<"documents" | "media">("documents");
    const client = useMatrixClientContext();

    useEffect(() => {
        initRouting();
    }, [client]);

    useEffect(() => {
        setSelectedFiles(Object.keys(rowSelection).map((i) => documents[parseInt(i)]));
    }, [rowSelection, documents]);

    const handleDialogOpen = (): void => {
        if (!dialogOpen) {
            setMedia([]);
            setDocuments([]);
            // setSelectedFiles([]);
            setRowSelection({});
            setDialogOpen(true);
        }
    };

    const fetchFiles = async (): Promise<void> => {
        const fetchedFiles = await getUserFiles(client);
        setDocuments([...fetchedFiles.filter((f) => f.type === MsgType.File)]);
        setMedia([...fetchedFiles.filter((f) => f.type === MsgType.Image)]);
    };

    const handleDialogOpenChange = async (open: boolean): Promise<void> => {
        if (open) {
            await fetchFiles();
            dis.dispatch({
                action: "select_files",
                files: [],
                roomId: props.roomId,
                context: timelineRenderingType,
            });
            dis.dispatch({
                action: "select_database",
                database: "",
                roomId: props.roomId,
                context: timelineRenderingType,
            });
        } else {
            setDialogOpen(false);
        }
    };

    const handleImageSelect = (image: MediaItem): void => {
        setSelectedFiles(() => [image as File]);
        setDialogOpen(false);
        dis.dispatch({
            action: "select_files",
            files: [
                {
                    mediaId: image.mediaId,
                    name: image.name,
                    roomId: props.roomId,
                    eventId: image.mxEvent?.getId(),
                },
            ],
            // files: selectedFiles.map((file)=>{return{mediaId: file.mediaId, name: file.name, roomId: file.roomId, eventId: file.mxEvent?.getId()}}),
            roomId: props.roomId,
            context: timelineRenderingType,
        });
        dis.dispatch({
            action: Action.FocusAComposer,
            context: timelineRenderingType,
        });
    };

    const handleClickDone = (): void => {
        setDialogOpen(false);
        if (selectedFiles.length > 0) {
            dis.dispatch({
                action: "select_files",
                files: selectedFiles.map((file) => {
                    return {
                        mediaId: file.mediaId,
                        name: file.name,
                        roomId: file.roomId,
                        eventId: file.mxEvent?.getId(),
                    };
                }),
                roomId: props.roomId,
                context: timelineRenderingType,
            });
            dis.dispatch({
                action: Action.FocusAComposer,
                context: timelineRenderingType,
            });
        }
    };

    return (
        <>
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                    <AccessibleTooltipButton
                        title="Select Files"
                        className="mx_MessageComposer_button files_button"
                        onClick={handleDialogOpen}
                    >
                        <div className="hidden" />
                    </AccessibleTooltipButton>
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] p-0 overflow-hidden">
                    <div className="relative w-[90vw] max-w-[90vw] h-[90vh] p-4">
                        <h2 className="text-2xl font-semibold tracking-tight my-1">Select Files</h2>
                        <FilesTabs className="mb-4" displayType={displayType} setDisplayType={setDisplayType} />
                        {displayType === "documents" && (
                            <FilesTable
                                data={documents}
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                                mode="dialog"
                            />
                        )}
                        <div style={{ display: displayType === "media" ? "block" : "none" }}>
                            <MediaGrid media={media} mode="dialog" onImageSelect={handleImageSelect} />
                        </div>

                        <div
                            className={cn(
                                "absolute bottom-0 inset-x-0 flex p-2 border-t items-center bg-background z-[1]",
                                selectedFiles.length > 0 ? "justify-between" : "justify-end",
                            )}
                        >
                            {selectedFiles.length > 0 && (
                                <div className="text-sm text-muted-foreground ml-2">
                                    {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"} selected
                                </div>
                            )}
                            <Button disabled={selectedFiles.length === 0} onClick={handleClickDone}>
                                Done
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
