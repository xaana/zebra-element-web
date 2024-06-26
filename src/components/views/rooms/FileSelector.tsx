import React, { useContext, useEffect, useState } from "react";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import { CollapsibleButton } from "matrix-react-sdk/src/components/views/rooms/CollapsibleButton";
import { RowSelectionState } from "@tanstack/react-table";
import { OverflowMenuContext } from "matrix-react-sdk/src/components/views/rooms/MessageComposerButtons";

import { init as initRouting } from "../../../vector/routing";

import "./style/button.css";
import { MatrixFile as File } from "@/plugins/files/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FilesTable } from "@/components/files/FilesTable";
import FilesTabs from "@/components/files/FilesTabs";
import { MediaGrid, MediaItem } from "@/components/files/MediaGrid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dtoToFileAdapters, listFiles } from "@/components/files/FileOpsHandler";
import { Loader } from "@/components/ui/LoaderAlt";

interface IProps {
    roomId: string;
}

export interface DocFile {
    mediaId: string;
    name: string;
    eventId?: string;
    roomId?: string;
}

export const FileSelector = (props: IProps): JSX.Element => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [media, setMedia] = useState<File[] | undefined>();
    const [documents, setDocuments] = useState<File[] | undefined>();
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const { timelineRenderingType } = useContext(RoomContext);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [displayType, setDisplayType] = useState<"documents" | "media">("documents");
    const client = useMatrixClientContext();
    // const allFiles = useRef<File[]>([]);

    const overflowMenuCloser = useContext(OverflowMenuContext);

    useEffect(() => {
        initRouting();
    }, [client]);

    // useEffect(() => {
    //     return () => {
    //         allFiles.current.forEach(async (file) => {
    //             // Asynchronous cleanup if necessary or synchronous access to URLs
    //             file.mediaHelper.destroy();
    //         });
    //     };
    // }, []);

    useEffect(() => {
        if (!documents) return;
        setSelectedFiles(Object.keys(rowSelection).map((i) => documents[parseInt(i)]));
    }, [rowSelection, documents]);

    const handleDialogOpen = (): void => {
        if (!dialogOpen) {
            if (documents) {
                setMedia([]);
                setDocuments([]);
            }

            // setSelectedFiles([]);
            setRowSelection({});
            setDialogOpen(true);
        }
    };

    const fetchFiles = async (): Promise<void> => {
        // const fetchedFiles = await getUserFiles(client);
        const fetchedFiles = (await listFiles(client.getUserId() ?? "", undefined, "zebra")).map((item) =>
            dtoToFileAdapters(item, client.getUserId()),
        );
        // allFiles.current = fetchedFiles;
        setDocuments([...fetchedFiles.filter((f) => f.mimetype && !f.mimetype.startsWith("image/"))]);
        setMedia([...fetchedFiles.filter((f) => f.mimetype && f.mimetype.startsWith("image/"))]);
    };

    const onUpdate = (): void => {
        fetchFiles();
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
            overflowMenuCloser?.();
        }
    };

    const handleImageSelect = (image: MediaItem): void => {
        setSelectedFiles(() => [image as File]);
        overflowMenuCloser?.();
        setDialogOpen(false);
        dis.dispatch({
            action: "select_files",
            files: [
                {
                    mediaId: image.mediaId,
                    name: image.name,
                    roomId: props.roomId,
                    eventId: image.event,
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
        overflowMenuCloser?.();
        setDialogOpen(false);
        if (selectedFiles.length > 0) {
            dis.dispatch({
                action: "select_files",
                files: selectedFiles.map((file) => {
                    return {
                        mediaId: file.mediaId,
                        name: file.name,
                        roomId: file.roomId,
                        eventId: file.event,
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
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                <CollapsibleButton
                    style={{ color: "#6100FF" }}
                    title="Select Files"
                    className="mx_MessageComposer_button"
                    iconClassName="files_button"
                    onClick={handleDialogOpen}
                />
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[90vw] h-[100vh] p-0 overflow-y-auto">
                {!documents && (
                    <div className="relative w-[90vw] max-w-[90vw] h-full p-4">
                        <h2 className="text-2xl font-semibold tracking-tight my-1">Select Files</h2>
                        <FilesTabs
                            className="mb-4"
                            displayType={displayType}
                            setDisplayType={setDisplayType}
                            setRowSelection={setRowSelection}
                        />
                        <Loader className="w-full h-full flex justify-center" height="50" width="50" />
                    </div>
                )}
                {documents && (
                    <div className="relative w-[90vw] max-w-[90vw] h-full p-4">
                        <h2 className="text-2xl font-semibold tracking-tight my-1">Select Files</h2>
                        <FilesTabs
                            className="mb-4"
                            displayType={displayType}
                            setDisplayType={setDisplayType}
                            setRowSelection={setRowSelection}
                        />
                        <div className="mb-14">
                            {displayType === "documents" && (
                                <FilesTable
                                    data={documents}
                                    rowSelection={rowSelection}
                                    setRowSelection={setRowSelection}
                                    mode="dialog"
                                    onUpdate={onUpdate}
                                />
                            )}
                            <div style={{ display: displayType === "media" ? "block" : "none" }}>
                                <MediaGrid media={media} mode="dialog" onImageSelect={handleImageSelect} />
                            </div>
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
                )}
            </DialogContent>
        </Dialog>
    );
};
