import React, { useEffect, useState } from "react";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { MatrixEvent, Room } from "matrix-js-sdk/src/matrix";
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";

import { MatrixFile as File } from "../../plugins/files/types";
import { MediaGridItem } from "./MediaGridItem";

import { RingLoader } from "@/components/ui/loaders/ring-loader";

export interface MediaItem extends File {
    srcBlob: Blob;
    srcUrl: string;
    currentFile: File;
    thumbnailBlob?: Blob;
    thumbnailUrl?: string;
}

export const MediaGrid = ({
    media,
    mode,
    onImageSelect,
    onDelete,
}: {
    media: File[];
    mode: "dialog" | "standalone";
    onImageSelect?: (image: MediaItem) => void;
    onDelete?: (currentFile: any, sender:string) => void;
}): JSX.Element => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [showLoading, setShowLoading] = useState<boolean>(true);
    const client = useMatrixClientContext();

    useEffect(() => {
        async function processMedia(): Promise<void> {
            if (!media) return;
            const mediaItemsPromises = media.map(async (m) => {
                try {
                    if (m.roomId && m.event) {
                        const room: Room | null = client.getRoom(m.roomId);
                        const event: MatrixEvent | undefined = room?.findEventById(m.event);
                        if (event) {
                            m.mediaHelper = new MediaEventHelper(event);
                            m.mxEvent = event;
                        }
                    }

                    // Fetch blobs concurrently if possible
                    const [blob, thumbnailBlob] = await Promise.all([
                        m.mediaHelper?.sourceBlob.value,
                        m.mediaHelper?.thumbnailBlob.value.catch((e) => {
                            console.error("Error fetching thumbnail", e);
                            return null;
                        }), // Handle thumbnail error separately
                    ]);
                    if (!blob) return null; // Return null if blob fetch fails
                    // Create media item object
                    const mediaItem = {
                        ...m,
                        srcBlob: blob,
                        currentFile: m,
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
            setMediaItems(() => [...resolvedMediaItems]);
            setShowLoading(false);
        }

        // Call processMedia with the media array
        processMedia();
    }, [media]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleImageSelect = (item: MediaItem): void => {
        onImageSelect?.(item);
    };
    return (
        <>
            {showLoading ? (
                <div className="flex justify-center items-center w-full p-20">
                    <RingLoader size={48} />
                </div>
            ) : mediaItems.length === 0 ? (
                <div className="flex justify-center items-center w-full p-20">No media file found</div>
            ) : (
                <>
                    <ul className="w-full mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                        {mediaItems.map((item, index) => {
                            return (
                                <MediaGridItem
                                    key={index}
                                    mediaItem={item}
                                    showActionButtons={mode === "standalone"}
                                    onImageSelect={mode === "dialog" ? handleImageSelect : undefined}
                                    onDelete={onDelete}
                                />
                            );
                        })}
                    </ul>
                </>
            )}
        </>
    );
};
