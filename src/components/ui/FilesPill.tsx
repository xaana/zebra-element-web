import React, { useEffect } from "react";
import { TimelineRenderingType } from "matrix-react-sdk/src/contexts/RoomContext";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { FileText, X } from "lucide-react";

import { DocFile } from "../views/rooms/FileSelector";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import { FileDownloader } from "matrix-react-sdk/src/utils/FileDownloader";

// Define a functional component
const FilesPill = ({
    file,
    files,
    timelineRenderingType,
    roomId,
}: {
    file: DocFile | undefined;
    files?: DocFile[] | undefined;
    timelineRenderingType?: TimelineRenderingType;
    roomId?: string;
}): React.JSX.Element | null => {
    // Styles for the pill container
    const client  = useMatrixClientContext();
    const [pdfUrl, setPdfUrl] = React.useState<string>("");

    useEffect(() => {

        return ()=>{
            if(pdfUrl) URL.revokeObjectURL(pdfUrl);
        }
    }, []);

    const downloadFile = async (e: React.SyntheticEvent, file: DocFile): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();
        if(!file.name.endsWith(".pdf")){
            const room = client.getRoom(file.roomId);
            const event = room?.findEventById(file.eventId!);
            if (!room||!event) return;
            const helper = new MediaEventHelper(event);
            try {
                const decryptedBlob = await helper.sourceBlob.value;
                const fileDownloader = new FileDownloader();
                fileDownloader.download({
                    blob: decryptedBlob,
                    name: file.name,
                    autoDownload: true,
                }).then(()=>{
                    helper.destroy();
                });
            } catch (err) {
                console.error('Unable to download file: ', err);
            }
        }else{
        if(!pdfUrl){
            const room = client.getRoom(file.roomId);
            const event = room?.findEventById(file.eventId!);
            if (!room||!event) return;
            const helper = new MediaEventHelper(event);
            try {
                const decryptedBlob = await helper.sourceBlob.value;
                const blob = new Blob([decryptedBlob], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfUrl(url)
                window.open(url, '_blank');
                helper.destroy();
            } catch (err) {
                console.error('Unable to download file: ', err);
            }
        }
        else{
            window.open(pdfUrl, '_blank');
        }}
        
    };

    const cancelQuoting = (): void => {
        const temp = files?.filter((f) => f.mediaId !== file?.mediaId);
        dis.dispatch({
            action: "select_files",
            files: temp,
            roomId: roomId,
            context: timelineRenderingType,
        });
    };

    const truncateFilename = (name: string, maxLength: number = 25) => {
        if (name.length > maxLength) {
            return `${name.substring(0, maxLength - 3)}...`;
        }
        return name;
    };


    if (!file) return null;

    return (
        <div className="py-2 px-4 bg-muted rounded-lg gap-2 w-60">
            {timelineRenderingType && (
                <div className="relative">
                    <X onClick={() => cancelQuoting()} className="cursor-pointer top-0 right-0 absolute text-xs" />
                </div>
            )}
            <div className="flex flex-row text-sm w-full items-center cursor-pointer" key={file.mediaId} onClick={(e)=>downloadFile(e,file)}>
                <FileText size={30} />
                <div className="text-xs">{truncateFilename(file.name)}</div>
            </div>
        </div>
    );
};

export default FilesPill;
