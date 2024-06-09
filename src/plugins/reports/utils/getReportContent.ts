import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

export const getReportContent = async (reportId: string): Promise<any | void> => {
    try {
        const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/get_document_html`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ document_id: reportId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
        // return;
    }
};
