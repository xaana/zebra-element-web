import React, { useEffect, useState } from "react";
import { IContent, MatrixEvent } from "matrix-js-sdk/src/matrix";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { Button } from "../ui/button";
import { IconTable } from "../ui/icons";
import { Sheet, SheetContent, SheetPortal } from "../ui/sheet";
// eslint-disable-next-line import/order
import { Citations } from "./citations";
import { getVectorConfig } from "@/vector/getconfig";
import { getUserFiles } from "@/lib/utils/getUserFiles";

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
    // const client = useMatrixClientContext();

    const client = useMatrixClientContext();

    useEffect(() => {
        getVectorConfig().then((config) => {
            if (config?.plugins["reports"]) {
                setApiUrl(config?.plugins["reports"].api);
            }
        });
        return ()=>{pdfUrls.forEach(pdf => {
            URL.revokeObjectURL(pdf.url);
        });}
    }, []);

    useEffect(() => {
        const fetchFiles = async (): Promise<void> => {
            const fetchedFiles = await getUserFiles(client);
            const thread = mxEvent.getThread();
            let files: any = [];
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
            // const files = content.files_.map((file:any)=>{
            //     return file.mediaId
            // })
            const temp = fetchedFiles.filter((file) => {
                return files.includes(file.mediaId);
            });
            const tempFiles = temp.map(async (file) => {
                if (file.name.endsWith(".pdf")) {
                    if (file.mxEvent?.isEncrypted()) {
                        // encrypted pdf
                        // const blob = await file.mediaHelper.sourceBlob.value;
                        const url = await file.mediaHelper.sourceUrl.value;
                        // const Pdf = new Blob([blob], { type: "application/pdf" });
                        // const pdfUrl = URL.createObjectURL(Pdf);
                        return { name: file.name, url: url };
                    } else {
                        // const downloadUrl = file.downloadUrl;
                        // if (downloadUrl) {
                        //     const data = await fetchResourceAsBlob(downloadUrl);
                        //     if (data) {
                        //         const pdfUrl = URL.createObjectURL(data);
                        //         return { name: file.name, url: pdfUrl };
                        //     }
                        // }
                        // unencrypted pdf
                        const url = await file.mediaHelper.sourceUrl.value;
                        return { name: file.name, url: url };
                    }
                } else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
                    const pdfUrl = await fetchPdfAndCreateObjectURL(file.mediaId.substring(6).split("/").pop() || "");
                    return pdfUrl;
                }
            });

            if (tempFiles) {
                Promise.all(tempFiles).then((res) => {
                    setPdfUrls(res.filter((element) => element !== undefined));
                });
            }
        };
        if (apiUrl) {
            fetchFiles();
        }
    }, [apiUrl]);

    // useEffect(() => {
    //     if (events.length === 0) return;

    //     const tempPdfs = events.map(async (event) => {
    //         const mxcUrl = event.getContent().url ?? event.getContent().file?.url;
    //         if (mxcUrl&&urls.includes(mxcUrl)){
    //             const tempFile = findDocFileById(mxcUrl)
    //             if (tempFile?.fileName.endsWith(".pdf")){
    //                 if (event.isEncrypted()) {
    //                     const mediaHelper = new MediaEventHelper(event);
    //                     try {
    //                         const temp = await mediaHelper.sourceBlob.value;
    //                         // If the Blob type is not 'application/pdf', create a new Blob with the correct type
    //                         const Pdf = new Blob([temp], { type: "application/pdf" });
    //                         const pdfUrl = URL.createObjectURL(Pdf);

    //                         return { name: event.getContent().body, url: pdfUrl };
    //                     } catch (err) {
    //                         console.error("decryption error", err);
    //                     }
    //                 }
    //                 else{
    //                     const downloadUrl = client.mxcUrlToHttp(mxcUrl)
    //                     if (downloadUrl){
    //                         const data = await fetchResourceAsBlob(downloadUrl)
    //                         if(data){
    //                             const pdfUrl = URL.createObjectURL(data)
    //                             return { name: event.getContent().body, url: pdfUrl};
    //                         }
    //                     }
    //                 }
    //             }else if (tempFile&&(tempFile.fileName.endsWith(".doc")||tempFile.fileName.endsWith(".docx"))){
    //                 const pdfUrl = await fetchPdfAndCreateObjectURL(mxcUrl.substring(6).split("/").pop())
    //                 return pdfUrl
    //             }

    //         }
    //     });
    //     if (tempPdfs) {
    //         Promise.all(tempPdfs).then((res) => {
    //             setPdfUrls(res.filter(element => element !== undefined));
    //         });
    //     }
    // }, [events]);

    // function findDocFileById(mediaId: string): DocFile | undefined {
    //     return docFiles.find(docFile => docFile.mediaId === mediaId);
    // }

    async function fetchPdfAndCreateObjectURL(mediaId: string): Promise<{ name: string; url: string }> {
        try {
            const payload = {
                media_ids: mediaId,
            };
            const url = `${apiUrl}/api/get_docfile`;
            const request = new Request(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const response = await fetch(request);
            const jsonResponse = await response.json(); // Assuming the server returns just a Base64 string
            const base64String = await jsonResponse.pdf.content;
            const fileName = jsonResponse.pdf.filename;

            // Convert Base64 string to a Blob
            const pdfBlob = base64ToBlob(base64String, "application/pdf");

            // Create a Blob URL
            const objectURL = URL.createObjectURL(pdfBlob);
            return { name: fileName[0], url: objectURL };
        } catch (error) {
            console.error("Error fetching or converting PDF:", error);
            throw error;
        }
    }

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
    if (pdfUrls.length === 0) {
        return null;
    }
    return (
        <>
            <Button
                variant="secondary"
                className="font-normal text-xs cursor-pointer !border-black border border-solid h-7"
                onClick={() => {
                    setShowCitations(!showCitations);
                }}
                disabled={showCitations}
            >
                <IconTable className="mr-2" />
                {/* {showCitations ? "Hide Citations" : "Show Citations"} */}
                Show Citations
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
