import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

export async function convertImageUrlToBase64(url: string): Promise<string | ArrayBuffer | null> {
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

const fetchPdf = async (formData: FormData): Promise<Blob | void> => {
    try {
        const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate-pdf/generate`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Network response was not ok.");

        const blob = await response.blob();
        if (blob) {
            return blob;
        }
    } catch (error) {
        console.error("Error fetching PDF:", error);
    }
};

export const generatePdf = async (editorContentHtml: string): Promise<Blob | void> => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(editorContentHtml, "text/html");
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
    await Promise.all(imagePromises);
    const formData = new FormData();
    formData.append("html_content", doc.documentElement.outerHTML);

    // Now it's safe to call fetchPdf
    const pdfBlob = await fetchPdf(formData);
    return pdfBlob;
};
