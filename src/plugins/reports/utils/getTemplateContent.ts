import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

export const getTemplateContent = async (templateId: string): Promise<string | void> => {
    try {
        const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/template/get_document`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ document_id: templateId }),
        });
        const data = await response.json();
        return data.document;
    } catch (error) {
        console.error("Error fetching data:", error);
        // throw error;
        return;
    }
};
