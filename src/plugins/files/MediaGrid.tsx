import React, { useEffect, useState } from "react";

import { File } from "./types";

export const MediaGrid = ({ images }: { images: File[] }): JSX.Element => {
    const [media, setMedia] = useState<string[]>([]);
    useEffect(() => {
        const getBlobs = async (): Promise<void> => {
            for (const image of images) {
                const blob: Blob = await image.mediaHelper.sourceBlob.value;
                setMedia((media) => [...media, URL.createObjectURL(blob)]);
            }
        };

        getBlobs();
    }, [images]);
    return (
        <div className="w-full flex flex-wrap gap-2 items-start mt-4">
            {media.map((media, index) => {
                return (
                    <div
                        key={index}
                        className="flex-1 basis-1/3 max-w-[240px] object-cover rounded-sm overflow-hidden bg-primary"
                    >
                        <img
                            className="w-full h-full object-cover"
                            src={media}
                            // alt={image.name}
                        />
                    </div>
                );
            })}
        </div>
    );
};
