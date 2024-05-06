import React, { useState } from "react";
import Modal from "matrix-react-sdk/src/Modal";
import ImageView from "matrix-react-sdk/src/components/views/elements/ImageView";
import { ComponentProps } from "matrix-react-sdk/src/Modal";
import { ImageContent } from "matrix-react-sdk/src/customisations/models/IMediaEventContent";

import type { MediaItem } from "./MediaGrid";

import { _t } from "@/languageHandler";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { IconZebra } from "@/components/ui/icons";

export const MediaGridItem = ({
    mediaItem,
    showActionButtons,
    onImageSelect,
}: {
    mediaItem: MediaItem;
    showActionButtons: boolean;
    onImageSelect?: (image: MediaItem) => void;
}): JSX.Element => {
    const [hover, setHover] = useState(false);

    const handleFullscreen = (): void => {
        if (mediaItem.mxEvent && mediaItem.srcUrl) {
            const content = mediaItem.mxEvent.getContent<ImageContent>();
            const params: Omit<ComponentProps<typeof ImageView>, "onFinished"> = {
                src: mediaItem.srcUrl,
                name: content.body && content.body.length > 0 ? content.body : _t("common|attachment"),
                mxEvent: mediaItem.mxEvent,
            };
            if (content.info) {
                params.width = content.info.w;
                params.height = content.info.h;
                params.fileSize = content.info.size;
            }
            Modal.createDialog(ImageView, params, "mx_Dialog_lightbox", undefined, true);
        }
    };
    const handleZebraChat = (): void => {};
    return (
        <li
            className={cn("relative overflow-hidden rounded", !showActionButtons && "cursor-pointer")}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            onClick={() => onImageSelect?.(mediaItem)}
        >
            <img
                className="object-cover select-none w-full h-auto bg-gray-200 aspect-square"
                src={mediaItem.thumbnailUrl ?? mediaItem.srcUrl}
                alt={mediaItem.name}
            />

            <div
                className={cn(
                    "transition-all opacity-0 absolute bottom-0 inset-x-0 w-full p-3 h-full bg-gradient-to-t from-gray-900/80 to-gray-900/10 flex items-center justify-center gap-1 text-white font-bold text-lg",
                    hover && "opacity-100",
                )}
            >
                {showActionButtons && (
                    <>
                        <Button
                            className="h-auto w-auto rounded-full p-2"
                            size="sm"
                            variant="ghost"
                            onClick={handleFullscreen}
                        >
                            <Icon name="Fullscreen" className="w-5 h-5" strokeWidth={2} />
                        </Button>
                        <Button
                            className="h-auto w-auto rounded-full p-2"
                            size="sm"
                            variant="ghost"
                            onClick={handleZebraChat}
                        >
                            <IconZebra className="w-6 h-6" />
                        </Button>
                    </>
                )}
            </div>
        </li>
    );
};
