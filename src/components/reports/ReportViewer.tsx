import React, { useState, useEffect } from "react";

import { ContentHeader } from "./ContentHeader";

import { editorContentAtom } from "@/plugins/reports/stores/store";
import { reportsStore } from "@/plugins/reports/MainPanel";
interface ReportViewerProps {
    nextStep: () => void;
    prevStep: () => void;
}
export const ReportViewer = ({ nextStep, prevStep }: ReportViewerProps) => {
    const [pdfUrl, setPdfUrl] = useState("");

    async function convertImageUrlToBase64(url: string) {
        // Fetch the image
        const response = await fetch(url);
        // Convert the response to a blob
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // Resolve with the Base64 Data URL once reading is complete
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;

            // Read the blob as a Data URL (Base64)
            reader.readAsDataURL(blob);
        });
    }

    const fetchPdf = async (formData: FormData) => {
        try {
            const response = await fetch("http://localhost:8001/api/pdf", {
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
            console.error("Error fetching PDF:", error);
        }
    };

    useEffect(() => {
        const editorContent = reportsStore.get(editorContentAtom);
        if (!editorContent) {
            console.error("Editor content not found");
            return;
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(editorContent, "text/html");
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
    }, []);
    return (
        <>
            <ContentHeader nextStepAction={nextStep} prevStepAction={prevStep} />
            {pdfUrl.length > 0 && (
                <div>
                    <iframe title="pdf" src={pdfUrl} width="100%" height="800px" />
                </div>
            )}
        </>
    );
};
