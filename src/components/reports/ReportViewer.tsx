import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import type { Editor } from "@tiptap/react";

import { Loader } from "@/components/ui/loader";
import { ReportSave } from "@/components/reports/ReportSave";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

interface ReportViewerProps {
    editor: Editor | null;
    nextStep: () => void;
    prevStep: () => void;
}
export const ReportViewer = ({ editor, nextStep, prevStep }: ReportViewerProps): JSX.Element => {
    const [pdfUrl, setPdfUrl] = useState("");
    const [isPdfLoading, setisPdfLoading] = useState(false);

    async function convertImageUrlToBase64(url: string): Promise<string | ArrayBuffer | null> {
        // Fetch the image
        const response = await fetch(url);
        // Convert the response to a blob
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // Resolve with the Base64 Data URL once reading is complete
            reader.onloadend = (): void => resolve(reader.result);
            reader.onerror = reject;

            // Read the blob as a Data URL (Base64)
            reader.readAsDataURL(blob);
        });
    }

    const fetchPdf = async (formData: FormData): Promise<void> => {
        try {
            setisPdfLoading(true);
            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate-pdf/generate`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Network response was not ok.");

            const blob = await response.blob();
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                setPdfUrl(url); // Update state with the URL for the PDF
            }
        } catch (error) {
            // console.error('Error fetching PDF:', error)
            toast.error("Error displaying PDF. Please try again later.");
        }
        setisPdfLoading(false);
    };

    useEffect(() => {
        if (!editor) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(editor.getHTML(), "text/html");
        const images = doc.querySelectorAll("img");

        // Map each image to a promise
        const imagePromises = Array.from(images).map(async (img) => {
            const src = img.getAttribute("src");
            if (src?.startsWith("blob:")) {
                const base64: any = await convertImageUrlToBase64(src);
                img.src = base64.toString();
            } else if (src?.startsWith("/")) {
                const base64: any = await convertImageUrlToBase64(window.location.origin + src);
                img.src = base64.toString();
            }
        });

        // Wait for all promises to resolve
        Promise.all(imagePromises).then(() => {
            const formData = new FormData();
            formData.append("html_content", doc.documentElement.outerHTML);

            // Now it's safe to call fetchPdf
            fetchPdf(formData);
        });
    }, [editor]);
    return (
        <>
            <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Finalise the Report</h2>
                    <p className="text-muted-foreground text-sm">
                        View the generated report and save it to your collection
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => prevStep()} variant="outline" size="sm">
                        <Icon name="ArrowLeft" className="mr-2" />
                        Go Back
                    </Button>
                    {editor && <ReportSave editor={editor} />}
                </div>
            </div>
            {isPdfLoading && (
                <div className="w-full p-20 flex justify-center items-center">
                    <Loader height="50" width="50" />
                </div>
            )}
            {pdfUrl.length > 0 && (
                <div>
                    <iframe title="pdf" src={pdfUrl} width="100%" height="800px" />
                </div>
            )}
        </>
    );
};
