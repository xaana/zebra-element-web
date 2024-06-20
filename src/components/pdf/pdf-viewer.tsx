import React, { useEffect, useRef, useState } from "react";
import { IContent, MatrixEvent } from "matrix-js-sdk/src/matrix";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { Button } from "../ui/button";
import { IconTable } from "../ui/icons";
import { Sheet, SheetContent, SheetPortal } from "../ui/sheet";
// eslint-disable-next-line import/order
import { Citations } from "./citations";

import { getUserFiles } from "@/lib/utils/getUserFiles";
import type { File } from "@/plugins/files/types";
import { Loader } from "../ui/loader";

export const PdfViewer = ({
    citations,
    content,
    mxEvent,
}: {
    citations: any[];
    content: IContent;
    mxEvent: MatrixEvent;
}): JSX.Element|null => {
    const [showCitations, setShowCitations] = useState(false);
    const [pdfUrls, setPdfUrls] = useState<any>([]);
    // const [events, setEvents] = useState<MatrixEvent[]>([]);
    // const [urls,setUrls] = useState<string[]>([]);
    // const [docFiles,setDocFiles] = useState<File[]>([]);
    const [apiUrl, setApiUrl] = useState<string>("");
    const [allMediaIds, setAllMediaIds] = useState<string[]>([]);
    const allFiles = useRef<string[]>([]);
    // const client = useMatrixClientContext();

    // const client = useMatrixClientContext();

    useEffect(() => {
        setApiUrl(SettingsStore.getValue("reportsApiUrl"));
        let files: any = [];
        const thread = mxEvent.getThread();
        if (thread) {
            for (const evt of thread.timeline) {
                const content = evt.getContent();
                if (content?.files_) {
                    const temp = content.files_.map((file: any) => {
                        return file.mediaId;
                    });
                    files = [...files, ...temp];
                }
            }
        }
        const uniqueSet = new Set<string>(files);

        // Convert the Set back into an array
        const uniqueList:string[] = Array.from(uniqueSet);
        setAllMediaIds(uniqueList);

        return ()=>{
            allFiles.current.forEach((url) => {
                // Asynchronous cleanup if necessary or synchronous access to URLs
                URL.revokeObjectURL(url);
            })
        }
    }, []);

    useEffect(() => {
        if(!showCitations){
            allFiles.current.forEach((url) => {
                // Asynchronous cleanup if necessary or synchronous access to URLs
                URL.revokeObjectURL(url);
            })
            allFiles.current = [];
            setPdfUrls([]);
        }
    },[showCitations])

    // useEffect(() => {
    //     const fetchFiles = async (): Promise<void> => {
    //         const fetchedFiles = await getUserFiles(client);
    //         allFiles.current = fetchedFiles;
    //         const thread = mxEvent.getThread();
    //         let files: any = [];
    //         if (thread) {
    //             for (const evt of thread.timeline) {
    //                 const content = evt.getContent();
    //                 if (content?.files_) {
    //                     const temp = content.files_.map((file: any) => {
    //                         return file.mediaId;
    //                     });
    //                     files = [...files, ...temp];
    //                 }
    //             }
    //         }
    //         // const files = content.files_.map((file:any)=>{
    //         //     return file.mediaId
    //         // })
    //         const temp = fetchedFiles.filter((file) => {
    //             return files.includes(file.mediaId);
    //         });
    //         const tempFiles = temp.map(async (file) => {
    //             if (file.name.endsWith(".pdf")) {
    //                 if (file.mxEvent?.isEncrypted()) {
    //                     // encrypted pdf
    //                     // const blob = await file.mediaHelper.sourceBlob.value;
    //                     const url = await file.mediaHelper.sourceUrl.value;
    //                     // const Pdf = new Blob([blob], { type: "application/pdf" });
    //                     // const pdfUrl = URL.createObjectURL(Pdf);
    //                     return { name: file.name, url: url };
    //                 } else {
    //                     // const downloadUrl = file.downloadUrl;
    //                     // if (downloadUrl) {
    //                     //     const data = await fetchResourceAsBlob(downloadUrl);
    //                     //     if (data) {
    //                     //         const pdfUrl = URL.createObjectURL(data);
    //                     //         return { name: file.name, url: pdfUrl };
    //                     //     }
    //                     // }
    //                     // unencrypted pdf
    //                     const url = await file.mediaHelper.sourceUrl.value;
    //                     return { name: file.name, url: url };
    //                 }
    //             } else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
    //                 const pdfUrl = await fetchPdfAndCreateObjectURL(file.mediaId.substring(6).split("/").pop() || "");
    //                 return pdfUrl;
    //             }
    //         });

    //         if (tempFiles) {
    //             Promise.all(tempFiles).then((res) => {
    //                 setPdfUrls(res.filter((element) => element !== undefined));
    //             });
    //         }
    //     };
    //     if (apiUrl) {
    //         fetchFiles();
    //     }
    // }, [apiUrl]);
    
    async function fetchPdfAndCreateObjectURL(mediaIds: string[]): Promise<{ name: string; url: string }[]> {
        try {
            const payload = { media_ids: mediaIds };
            const url = `${apiUrl}/api/get_docfile`;
            const request = new Request(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const response = await fetch(request);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonResponse = await response.json();
            const pdfFiles = jsonResponse.pdf.map((file: any) => {
                const contentBase64 = file.content;
                const pdfBlob = base64ToBlob(contentBase64, 'application/pdf');
                const objectURL = URL.createObjectURL(pdfBlob);
                allFiles.current.push(objectURL);
                return { name: file.filename, url: objectURL };
            });
            return pdfFiles;
        } catch (error) {
            console.error('Error fetching or converting PDF:', error);
            throw error;
        }
    }


    // async function temp(mediaIds: string[]): Promise<{ name: string; url: string }> {
    //     try {
    //         const payload = {
    //             media_ids: mediaIds,
    //         };
    //         const url = `${apiUrl}/api/get_docfile`;
    //         const request = new Request(url, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(payload),
    //         });
    //         const response = await fetch(request);
    //         const jsonResponse = await response.json(); // Assuming the server returns just a Base64 string
    //         const base64String = await jsonResponse.pdf.content;
    //         const fileName = jsonResponse.pdf.filename;

    //         // Convert Base64 string to a Blob
    //         const pdfBlob = base64ToBlob(base64String, "application/pdf");

    //         // Create a Blob URL
    //         const objectURL = URL.createObjectURL(pdfBlob);
    //         return { name: fileName[0], url: objectURL };
    //     } catch (error) {
    //         console.error("Error fetching or converting PDF:", error);
    //         throw error;
    //     }
    // }

    // Helper function to convert Base64 string to Blob
    function base64ToBlob(base64: string, contentType: string): Blob {
        const binaryString = window.atob(base64); // Decode Base64 to binary string
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return new Blob([bytes], { type: contentType });
    }

    async function fetchResourceAsBlob(url: string): Promise<Blob | undefined> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error("Error fetching the blob:", error);
        }
    }
    if (citations===undefined) {
        return null;
    }
    if(allMediaIds.length === 0||apiUrl===undefined) {
        return null;
    }
    return (
        <>
            <Button
                variant="secondary"
                className="font-normal text-xs cursor-pointer !border-black border border-solid h-7"
                onClick={() => {
                    setShowCitations(!showCitations);
                    fetchPdfAndCreateObjectURL(allMediaIds).then((res) => {
                        setPdfUrls(res);
                    })
                }}
                disabled={showCitations}
            >
                <IconTable className="mr-2" />
                {/* {showCitations ? "Hide Citations" : "Show Citations"} */}
                {citations.length>0?"Show Citations": "View Files"}
            </Button>
            <Sheet open={showCitations} onOpenChange={(open: boolean) => setShowCitations(open)} modal={false}>
                <SheetPortal>
                    <SheetContent className="min-w-[100vw] sm:min-w-[70vw] lg:min-w-[50vw] bg-secondary" side="left">
                        {pdfUrls.length>0?<Citations citations={citations} pdfUrls={pdfUrls} />:<Loader className="flex justify-center mt-[100px] w-full h-full" height="100" width="100" />}
                    </SheetContent>
                </SheetPortal>
            </Sheet>
        </>
    );
};
