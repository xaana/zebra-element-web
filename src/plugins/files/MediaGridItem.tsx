import React, { useState } from "react";
// import Modal from 'matrix-react-sdk/src/Modal';

import type { MediaItem } from "./MediaGrid";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
// import { Button } from '@/components/ui/button';

export const MediaGridItem = ({ mediaItem }: { mediaItem: MediaItem }): JSX.Element => {
    const [hover, setHover] = useState(false);
    return (
        <li
            className="relative overflow-hidden rounded"
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        >
            <img
                className="object-cover select-none w-full h-auto bg-gray-200 aspect-square"
                src={mediaItem.thumbnailUrl ?? mediaItem.srcUrl}
                alt={mediaItem.name}
            />

            <div
                className={cn(
                    "transition-all opacity-0 absolute bottom-0 inset-x-0 w-full p-3 h-full bg-gradient-to-t from-gray-900/80 to-gray-900/10 flex items-center justify-center text-white font-bold text-lg",
                    hover && "opacity-100",
                )}
            >
                {/* <Button variant="ghost" onClick={() => Modal.createDialog(ImageView, params, "mx_Dialog_lightbox", undefined, true)}>
                    </Button> */}
                <Icon name="Fullscreen" className="w-6 h-6" />
            </div>
        </li>
    );
};
