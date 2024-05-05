import React, { useContext, useEffect, useState } from "react";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import RoomContext from "matrix-react-sdk/src/contexts/RoomContext";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import AccessibleTooltipButton from "matrix-react-sdk/src/components/views/elements/AccessibleTooltipButton";
import { MsgType } from "matrix-js-sdk/src/matrix";

import { init as initRouting } from "../../../vector/routing";

import "./style/button.css";
import { File } from "@/plugins/files/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
import { useFiles } from "@/lib/hooks/use-files";

interface IProps {
    roomId: string;
}

export interface DocFile {
    mediaId: string;
    fileName: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const FileSelector = (props: IProps) => {
    // const [events, setEvents] = useState<MatrixEvent[]>([]);
    // const [files, setFiles] = useState<DocFile[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [media, setMedia] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const { timelineRenderingType } = useContext(RoomContext);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { getUserFiles } = useFiles();
    const client = useMatrixClientContext();
    useEffect(() => {
        initRouting();
    }, [client]);

    const handleDialogOpen = (): void => {
        if (!dialogOpen) {
            setMedia([]);
            setDocuments([]);
            setSelectedFiles([]);
            setDialogOpen(true);
        }
    };

    const fetchFiles = async (): Promise<void> => {
        const fetchedFiles = await getUserFiles();
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
            if (selectedFiles.length > 0) {
                dis.dispatch({
                    action: "select_files",
                    files: selectedFiles,
                    roomId: props.roomId,
                    context: timelineRenderingType,
                });
                dis.dispatch({
                    action: Action.FocusAComposer,
                    context: timelineRenderingType,
                });
            }
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
                <DialogContent className="w-[80vw] h-[90vh] p-10">File Manager</DialogContent>
            </Dialog>
        </>
    );
};
