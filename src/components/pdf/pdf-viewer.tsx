import React, { useEffect, useState } from "react";
import { Filter, MatrixEvent, Room } from "matrix-js-sdk/src/matrix";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { MediaEventHelper } from "matrix-react-sdk/src/utils/MediaEventHelper";

import { Button } from "../ui/button";
import { IconTable } from "../ui/icons";
import { Sheet, SheetContent, SheetPortal } from "../ui/sheet";
// eslint-disable-next-line import/order
import { Citations } from "./citations";
export const PdfViewer = ({ roomId, citations }: { roomId: string; citations: any[] }) => {
    const [showCitations, setShowCitations] = useState(false);
    const [pdfUrls, setPdfUrls] = useState<any>([]);
    const [events, setEvents] = useState<MatrixEvent[]>([]);
    const client = useMatrixClientContext();
    useEffect(() => {
        const fetchFileEventsServer = async (rooms: Room[]) => {
            const encryptedRooms = [];
            const plainRooms = [];
            for (const room of rooms) {
                if (client.isRoomEncrypted(room.roomId)) {
                    encryptedRooms.push(room);
                } else {
                    plainRooms.push(room);
                }
            }

            const plainFilter = new Filter(client.getSafeUserId());
            plainFilter.setDefinition({
                room: {
                    timeline: {
                        contains_url: true,
                        types: ["m.room.message"],
                    },
                },
            });

            plainFilter.filterId = await client.getOrCreateFilter(
                "FILTER_FILES_PLAIN_" + client.credentials.userId,
                plainFilter,
            );
            const plainTimelineSets = plainRooms.map((room) => room.getOrCreateFilteredTimelineSet(plainFilter));
            const plainEvents = plainTimelineSets.flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()));

            const encryptedFilter = new Filter(client.getSafeUserId());
            encryptedFilter.setDefinition({
                room: {
                    timeline: {
                        types: ["m.room.message"],
                    },
                },
            });

            encryptedFilter.filterId = await client.getOrCreateFilter(
                "FILTER_FILES_ENCRYPTED_" + client.credentials.userId,
                encryptedFilter,
            );
            const encryptedTimelineSets = encryptedRooms.map((room) =>
                room.getOrCreateFilteredTimelineSet(encryptedFilter),
            );
            const encryptedEvents = encryptedTimelineSets
                .flatMap((ts) => ts.getTimelines().flatMap((t) => t.getEvents()))
                .filter((ev) => ev.getContent().file);

            setEvents([...plainEvents, ...encryptedEvents]);
        };

        // initRouting();

        const currentRoom = client.getRoom(roomId);
        currentRoom && fetchFileEventsServer([currentRoom]);
    }, []);
    useEffect(() => {
        if (events.length === 0) return;
        const tempPdfs = events.map(async (event) => {
            const mxcUrl = event.getContent().url ?? event.getContent().file?.url;
            if (!mxcUrl) return;
            if (event.isEncrypted()) {
                const mediaHelper = new MediaEventHelper(event);
                try {
                    const temp = await mediaHelper.sourceBlob.value;
                    // If the Blob type is not 'application/pdf', create a new Blob with the correct type
                    const Pdf = new Blob([temp], { type: "application/pdf" });
                    const pdfUrl = URL.createObjectURL(Pdf);
                    return { name: event.getContent().body, url: pdfUrl };
                } catch (err) {
                    console.log("decryption error", err);
                }
            }
        });
        if (tempPdfs) {
            Promise.all(tempPdfs).then((res) => {
                setPdfUrls(res);
            });
        }
    }, [events]);

    return (
        <>
            <Button
                variant="secondary"
                className="font-normal text-xs cursor-pointer !border-black border border-solid"
                onClick={() => {
                    setShowCitations(!showCitations);
                }}
            >
                <IconTable className="mr-2" />
                {showCitations ? "Hide Citations" : "Show Citations"}
            </Button>
            <Sheet open={showCitations} onOpenChange={(open: boolean) => setShowCitations(open)} modal={false}>
                <SheetPortal>
                    <SheetContent className="min-w-[100vw] sm:min-w-[70vw] lg:min-w-[50vw] bg-secondary" side="left">
                        <Citations citations={citations} pdfUrls={pdfUrls} />
                    </SheetContent>
                </SheetPortal>
            </Sheet>
        </>
    );
};
