import * as React from "react";
import styled from "styled-components";
import { Button } from "@vector-im/compound-web";

import { IconChartDonut } from "../ui/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "../../lib/utils";

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
    handleViewCharts: () => void;
}

export const MessageChildDatabaseResult: React.FC<TableProps<DataItem>> = ({
    data,
    totalEntries,
    handleViewCharts,
}) => {
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
                                    <Button onClick={handleViewCharts} size="sm" className="text-xs gap-0 w-auto h-auto">
                                        <IconChartDonut className="h-3 w-3 mr-1" />
                                        Visualise
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </TableStyle>
        </div>
    );
};
