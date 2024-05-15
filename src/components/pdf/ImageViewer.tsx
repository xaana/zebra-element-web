import { MatrixEvent, Room } from "matrix-js-sdk/src/matrix";
import React, { useEffect, useState, ComponentProps } from "react";
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";
import { ImageContent } from "matrix-react-sdk/src/customisations/models/IMediaEventContent";
import { _t } from "@/languageHandler";
import ImageView from "matrix-react-sdk/src/components/views/elements/ImageView";
import Modal from "matrix-react-sdk/src/Modal";
import MImageBody from "matrix-react-sdk/src/components/views/messages/MImageBody";

// eslint-disable-next-line import/order
export const ImageViewer = ({ eventId,room }: { eventId: string; room: Room }) => {
    const [contentUrl, setContentUrl] = useState<string | null>();
    const [event, setEvent] = useState<MatrixEvent>();
    useEffect(() => {
        const temp = room.findEventById(eventId)
        if (temp){
            getImageData(temp);
            setEvent(temp);
        }

    },[])

    const getImageData = async (event: MatrixEvent) => {
        // const mxcUrl = event.getContent().url ?? event.getContent().file?.url;
            if (event.isEncrypted()) {
                const mediaHelper = new MediaEventHelper(event);
                try {
                    const temp = await mediaHelper.sourceUrl.value;
                    setContentUrl(temp)
                    // If the Blob type is not 'application/pdf', create a new Blob with the correct type
                    // const Pdf = new Blob([temp], { type: "application/pdf" });
                    // const pdfUrl = URL.createObjectURL(Pdf);
                    
                    // return { name: event.getContent().body, url: pdfUrl };
                } catch (err) {
                    console.error("decryption error", err);
                }
            }
            else{
                // const downloadUrl = client.mxcUrlToHttp(mxcUrl)
                // if (downloadUrl){
                //     const data = await fetchResourceAsBlob(downloadUrl)
                //     if(data){
                //         const pdfUrl = URL.createObjectURL(data)
                //         return { name: event.getContent().body, url: pdfUrl};
                //     }
                // }
                console.log("skip from now")
            }
    }
    const onClick = () => {
        if(event&&contentUrl){
            const content = event.getContent<ImageContent>();
            const httpUrl = contentUrl;
            const params: Omit<ComponentProps<typeof ImageView>, "onFinished"> = {
                src: httpUrl,
                name: content.body && content.body.length > 0 ? content.body : _t("common|attachment"),
                mxEvent: event,
                // permalinkCreator: this.props.permalinkCreator,
            };
            if (content.info) {
                params.width = content.info.w;
                params.height = content.info.h;
                params.fileSize = content.info.size;
            }
            Modal.createDialog(ImageView, params, "mx_Dialog_lightbox", undefined, true);
        }
        
    }

    return (
        <div className="">
           {/* <Button
                variant="secondary"
                className="font-normal text-xs cursor-pointer !border-black border border-solid h-7"
                onClick={() => onClick()}
            >
                <IconTable className="mr-2" />
                Show Image
            </Button> */}
            {event&&<MImageBody mxEvent={event} mediaEventHelper={new MediaEventHelper(event)} maxImageHeight={50} />}
        </div>
    );
};
