import React, { useEffect, useMemo } from "react";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { HocuspocusProvider } from "@hocuspocus/provider";

import { ReportEditor } from "@/components/reports/ReportEditor";
import { Report } from "@/plugins/reports/types";

interface CollaborationProviderProps {
    userId: string;
    selectedReport: Report;
    setSelectedReport: React.Dispatch<React.SetStateAction<Report | null | undefined>>;
}

export const CollaborationProvider = ({
    userId,
    selectedReport,
    setSelectedReport,
}: CollaborationProviderProps): JSX.Element => {
    const collabProvider = useMemo(
        () =>
            new HocuspocusProvider({
                url: SettingsStore.getValue("collabServerWebsocketUrl"),
                name: selectedReport.id.toString(),
                token: JSON.stringify({
                    userId: userId,
                    documentName: selectedReport.name,
                }),
            }),
        [userId, selectedReport.id, selectedReport.name],
    );

    useEffect(() => {
        return () => {
            console.log("Destroying collab provider");
            collabProvider.disconnect();
            collabProvider.destroy();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ReportEditor
            collabProvider={collabProvider}
            userId={userId}
            onGoBack={() => setSelectedReport(undefined)}
            initialContent={selectedReport.content}
        />
    );
};
