import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import { useState, useRef, createRef, useEffect } from "react";
import React from "react";

import { Button } from "../ui/button";
import { IconZoomIn, IconZoomOut } from "./../ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/PdfSelector/select";
import type { Citation } from "./citations-table";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { CitationsTable } from "./citations-table";

// eslint-disable-next-line import/order
import debounce from "lodash.debounce";

import type { BoundingBox } from "./citations-table";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://zebra.algoreus.net/pdf.worker.min.js`

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Loader } from "../ui/loader";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url
// ).toString()

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();
type PageRef = React.RefObject<HTMLDivElement>;
export function Citations({
    pdfUrls,
    citations, // setShowCitations
}: {
    pdfUrls: { url: string; name: string }[];
    citations: Citation[];
}) {
    const [numPages, setNumPages] = useState(0);
    const pageRefs = useRef<PageRef[]>([]);
    // const [currentPage, setCurrentPage] = useState(1)
    const [scale, setScale] = useState(-1);
    const [highlights, setHighlights] = useState<BoundingBox[]>([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState<string>("0");
    const [firstOpen,setFirstOpen] = useState<boolean>(true)
    const containerRef = useRef<HTMLDivElement>(null);
    const [pendingCitationView, setPendingCitationView] = useState<{
        page: number;
        highlights: BoundingBox[];
    } | null>(null);
    const onDocumentLoadSuccess = async ({ numPages }: { numPages: number }) => {
        console.log('Successfully loaded document');
        setNumPages(numPages);
        pageRefs.current = Array(numPages)
            .fill(null)
            .map((_, i) => pageRefs.current[i] || createRef());

        setTimeout(() => {
            if (pendingCitationView) {
                setHighlights(() => pendingCitationView.highlights);
                // scrollToPage(pendingCitationView.page)
                setPendingCitationView(() => null);
            }
        }, 500);
        if(citations.length > 0) { // Ensure there is at least one citation
        const firstCitation = citations[0]; // Access the first citation
        // when open the citation jump to the last citation automatically
        if(firstOpen){
            handleViewCitation(
                firstCitation.doc_name,
                String(firstCitation.page_num),
                parseBoundingBoxes(firstCitation.bboxes)
            );
            setFirstOpen(false)
        }
        
    }
    };
    const parseBoundingBoxes = (bboxes: string): BoundingBox[] => {
        return bboxes.split(";").map((bbox) => {
            const [x1, y1, x2, y2] = bbox.split(" ").map(parseFloat);
            return { x1, y1, x2, y2 };
        });
    };

    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.getBoundingClientRect().width;
                setScale(containerWidth / 650);
            }
        };

        // Create a debounced version of your updateScale function
        const debouncedUpdateScale = debounce(updateScale, 250);

        // Call your function directly the first time
        updateScale();

        // Use the debounced function for the resize event
        window.addEventListener("resize", debouncedUpdateScale);

        return () => {
            debouncedUpdateScale.cancel(); // Important: Cancel any queued debounced functions on cleanup
            window.removeEventListener("resize", debouncedUpdateScale);
        };
    }, []);

    // const scrollToPage = (page: number) => {
    //   pageRefs.current[page - 1].current?.scrollIntoView({
    //     behavior: 'smooth'
    //   })
    // }

    useEffect(() => {
        // Find the page container div and append highlights
        if (highlights.length === 0) return;
        const pageDiv = pageRefs.current[(highlights[0]?.page || 1) - 1]?.current;
        if (pageDiv) {
            // Remove existing highlights if any
            pageDiv.querySelectorAll(".bbox").forEach((el) => el.remove());
            // Append new highlights
            highlights.forEach((box) => {
                const highlightDiv = document.createElement("div");
                highlightDiv.classList.add("bbox", "absolute", "bg-yellow-400", "bg-opacity-30", "rounded");
                highlightDiv.style.left = `${box.x1 * scale}px`;
                highlightDiv.style.top = `${box.y1 * scale}px`;
                highlightDiv.style.width = `${(box.x2 - box.x1) * scale}px`;
                highlightDiv.style.height = `${(box.y2 - box.y1) * scale}px`;
                pageDiv.appendChild(highlightDiv);
                highlightDiv.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            });
        }
    }, [scale, highlights]);

    const handleViewCitation = async (documentName: string, pageNumber: string, bboxes: BoundingBox[]) => {
        if (Array.from(pdfUrls).length > 1) {
            const newFileIndex = String(Array.from(pdfUrls).findIndex((file) => file.name === documentName));
            setSelectedFileIndex(newFileIndex);
        }
        if (String(Array.from(pdfUrls).findIndex((file) => file.name === documentName)) !== selectedFileIndex) {
            // Set pending view actions to be applied after the document loads
            setPendingCitationView({
                page: parseInt(pageNumber),
                highlights: bboxes.map((box) => ({ ...box, page: parseInt(pageNumber) })),
            });
        } else {
            // setCurrentPage(() => parseInt(pageNumber))
            // scrollToPage(parseInt(pageNumber))
            setHighlights(() => bboxes.map((box) => ({ ...box, page: parseInt(pageNumber) })));
        }
    };
    return (
        <>
            {pdfUrls && citations ? (
                <div className="flex flex-col gap-y-3 h-full">
                    <div className="basis-3/5 min-h-[300px] overflow-hidden flex flex-col grow shrink-0">
                        <div className="flex items-center justify-between pt-4 pb-2">
                            <div className="basis-1/2">
                                <Select
                                    value={selectedFileIndex}
                                    onValueChange={(value) => setSelectedFileIndex(value)}
                                >
                                    <SelectTrigger className="file__select h-auto py-2 text-xs">
                                        <SelectValue placeholder="Select PDF File" />
                                    </SelectTrigger>
                                    <SelectContent asChild className="h-auto">
                                        {pdfUrls &&
                                            Array.from(pdfUrls).map((file, index) => (
                                                <SelectItem key={index} value={String(index)} className="text-xs">
                                                    {file.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    className="sticky right-0 top-0 z-10 !m-0"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setScale(scale - 0.1)}
                                >
                                    <IconZoomOut className="h-4 w-4 dark:fill-white group-[.maximised]/main:xl:h-5 group-[.maximised]/main:xl:w-5" />
                                </Button>
                                <Button
                                    className="sticky right-0 top-0 z-10 !m-0"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setScale(scale + 0.1)}
                                >
                                    <IconZoomIn className="h-4 w-4 dark:fill-white group-[.maximised]/main:xl:h-5 group-[.maximised]/main:xl:w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="rounded-lg border overflow-hidden">
                            <div
                                ref={containerRef}
                                className="pdf__container min-h-[50%] max-h-full bg-background p-2 overflow-auto scrollbar--custom"
                            >
                                {pdfUrls.length > 0 && (
                                    <Document
                                        file={pdfUrls[Number(selectedFileIndex)]}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        className="relative"
                                    >
                                        {Array.from(new Array(numPages), (_, index) => (
                                            <Page
                                                className={`page_${index + 1} relative`}
                                                renderAnnotationLayer={false}
                                                pageNumber={index + 1}
                                                scale={scale}
                                                inputRef={pageRefs.current[index]}
                                                key={index}
                                            />
                                        ))}
                                    </Document>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 basis-2/5 rounded-md border overflow-hidden">
                        <div className="bg-background h-full w-full overflow-auto scrollbar--custom">
                            <CitationsTable data={citations} onViewCitation={handleViewCitation} />
                        </div>
                    </div>
                </div>
            ) : (
                <Loader className="flex justify-center mt-[100px] w-full h-full" height="100" width="100" />
            )}
        </>
    );
}
