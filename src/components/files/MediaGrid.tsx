import React, { useEffect, useState } from "react";

import { File } from "../../plugins/files/types";
import { MediaGridItem } from "./MediaGridItem";

import { RingLoader } from "@/components/ui/loaders/ring-loader";

export interface MediaItem extends File {
    srcBlob: Blob;
    srcUrl: string;
    thumbnailBlob?: Blob;
    thumbnailUrl?: string;
}

export const MediaGrid = ({
    media,
    mode,
    onImageSelect,
}: {
    media: File[];
    mode: "dialog" | "standalone";
    onImageSelect?: (image: MediaItem) => void;
}): JSX.Element => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

    useEffect(() => {
        async function processMedia(): Promise<void> {
            const mediaItemsPromises = media.map(async (m) => {
                try {
                    // Fetch blobs concurrently if possible
                    const [blob, thumbnailBlob] = await Promise.all([
                        m.mediaHelper.sourceBlob.value,
                        m.mediaHelper.thumbnailBlob.value.catch((e) => {
                            console.error("Error fetching thumbnail", e);
                            return null;
                        }), // Handle thumbnail error separately
                    ]);

                    // Create media item object
                    const mediaItem = {
                        ...m,
                        srcBlob: blob,
                        srcUrl: URL.createObjectURL(blob),
                        ...(thumbnailBlob && { thumbnailBlob, thumbnailUrl: URL.createObjectURL(thumbnailBlob) }),
                    };

                    return mediaItem;
                } catch (err) {
                    console.error("Error fetching media blob", err);
                    return null; // Return null if main blob fetch fails
                }
            });

            // Resolve all promises and filter out any nulls (failed fetches)
            const resolvedMediaItems = (await Promise.all(mediaItemsPromises)).filter(
                (item) => item !== null,
            ) as MediaItem[];

            // Batch update state once with all new media items
            setMediaItems((items) => [...items, ...resolvedMediaItems]);
        }

        // Call processMedia with the media array
        processMedia();
    }, [media]);

    const handleImageSelect = (item: MediaItem): void => {
        onImageSelect?.(item);
    };
    return (
        <>
            {mediaItems.length === 0 ? (
                <div className="flex justify-center items-center w-full p-20">
                    <RingLoader size={48} />
                </div>
            ) : (
                <ul className="w-full mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                    {mediaItems.map((item, index) => {
                        return (
                            <MediaGridItem
                                key={index}
                                mediaItem={item}
                                showActionButtons={mode === "standalone"}
                                onImageSelect={mode === "dialog" ? handleImageSelect : undefined}
                            />
                        );
                    })}
                </ul>
            )}
        </>
    );
};
