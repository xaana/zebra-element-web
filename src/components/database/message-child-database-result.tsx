import * as React from "react";
import styled from "styled-components";
import { Sparkles , Download, ExternalLink } from "lucide-react";
import SpaceStore from "matrix-react-sdk/src/stores/spaces/SpaceStore";
import defaultDispatcher from "matrix-react-sdk/src/dispatcher/dispatcher";
import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { Button } from "../ui/button";
import { IconChartDonut } from "../ui/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";
import { PluginActions } from "../../plugins";

import { getVectorConfig } from "@/vector/getconfig";

const TableStyle = styled.div`
    .table__container > div::-webkit-scrollbar {
        height: 5px;
        width: 5px;
        background-color: #f5f5f5;
    }
    .table__container > div::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);
        background-color: #f5f5f5;
    }

    .table__container > div::-webkit-scrollbar-thumb {
        background-color: #a0a0a0;
        border-radius: 5px;
    }
`;

export type DataItem = {
    [key: string]: string | number | null | undefined;
};
interface TableProps<T extends DataItem> {
    data: T[];
    totalEntries: string | undefined;
    query: string;
    description: string;
    echartsData: string;
    eventId: string;
    echartsCode?: string;
    handleViewCharts: () => void;
}

export const MessageChildDatabaseResult: React.FC<TableProps<DataItem>> = ({
    data,
    totalEntries,
    query,
    description,
    echartsData,
    eventId,
    echartsCode,
    handleViewCharts,
}) => {
    const client = React.useContext(MatrixClientContext)

    const handleDataDownload = (): void => {
        const csv = [];
        csv.push(Object.keys(data[0])) ;
        for (const rowItem of data){
            csv.push(Object.values(rowItem).join(","))
        }
        const formattedData = csv.join('\n')
        const downloadName = "data.csv";
        const hiddenLink = document.createElement("a");
        hiddenLink.setAttribute("href", "data:application/bpmn20-xml;charset=UTF-8," + encodeURIComponent(formattedData));
        hiddenLink.setAttribute("download", downloadName);
        document.body.appendChild(hiddenLink);
        hiddenLink.click();
        document.body.removeChild(hiddenLink);
    }

    const handleAlgologyRedirect = async (): Promise<void> => {
        getVectorConfig().then((config)=>{
            const payload = {
                query: query,
                description: description,
                user_id: client.getSafeUserId(),
                eventId: eventId,
                echartsCode: echartsCode
            }
            return fetch(config?.plugins.reports.api + "/api/algology_mapping", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
        }).then(res=>res.json())
        .then(res=>{
            const dashboardId = res.message.dashboard_id;
            const panelId = res.message.panel_id;
            const uri = `d/${dashboardId}?viewPanel=${panelId}&`
            localStorage.setItem("pluginUri", uri)
            window.location.hash="/plugins/algology";
            window.matrixChat.setState({ activePluginName: "algology"});
            SpaceStore.instance.setActiveSpace("plugin.algology");
            defaultDispatcher.dispatch({ action: PluginActions.LoadPlugin, plugin: "algology" });
        })
    }

    return (
        <div className="w-full">
            <TableStyle>
                <div className="table__container rounded-md border border-solid scrollbar--custom">
                    {data && data.length > 0 && (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {Object.keys(data[0]).map((column, index) => (
                                            <TableHead key={index} className="font-normal">
                                                {column
                                                    .split("_")
                                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                    .join(" ")}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="font-mono">
                                    {data.map((row, index) => (
                                        <TableRow key={index}>
                                            {Object.values(row).map((column, index) => (
                                                <TableCell
                                                    className={cn(
                                                        "table-cell font-normal",
                                                        column && column.toString().length > 55 && `min-w-[450px]`,
                                                    )}
                                                    key={index}
                                                >
                                                    {column ? (
                                                        !isNaN(Number(column)) &&
                                                        !isNaN(parseFloat(column.toString())) &&
                                                        ![
                                                            "day",
                                                            "date",
                                                            "year",
                                                            "month",
                                                            "time",
                                                            "id",
                                                            "code",
                                                            "abn",
                                                            "phone",
                                                            "title",
                                                            "name",
                                                        ].some((substring) =>
                                                            Object.keys(data[0])
                                                                [index].toLowerCase()
                                                                .includes(substring),
                                                        ) ? (
                                                            <span>
                                                                {parseFloat(column.toString()).toLocaleString("en-AU")}
                                                            </span>
                                                        ) : (
                                                            column
                                                        )
                                                    ) : (
                                                        "-"
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="border-t w-full">
                                <div className="flex items-center justify-between">
                                    {totalEntries && (
                                        <div className="font-normal text-muted-foreground text-xs px-0">
                                            {data.length} of {totalEntries} rows displayed
                                        </div>
                                    )}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Button className="text-xs gap-0 w-auto h-7">
                                                <Sparkles />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="top">
                                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onSelect={handleViewCharts}>
                                                <IconChartDonut className="h-3 w-3 mr-1" />  Visualize
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={handleDataDownload}>
                                                <Download className="h-4 w-4 mr-2" />  Download
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={handleAlgologyRedirect}>
                                                <ExternalLink className="h-4 w-4 mr-2" />  View In Algology
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </TableStyle>
        </div>
    );
};
