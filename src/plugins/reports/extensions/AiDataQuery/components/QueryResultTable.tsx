import * as React from "react";
import styled from "styled-components";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

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
    handleViewCharts: () => void;
}

export const QueryResultTable: React.FC<TableProps<DataItem>> = ({ data, handleViewCharts }) => {
    return (
        <div className="zexa-w-full">
            <TableStyle>
                <div className="table__container zexa-rounded-md zexa-border scrollbar--custom">
                    {data && data.length > 0 && (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {Object.keys(data[0]).map((column, index) => (
                                            <TableHead key={index} className="zexa-font-normal">
                                                {column
                                                    .split("_")
                                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                    .join(" ")}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="zexa-font-mono">
                                    {data.map((row, index) => (
                                        <TableRow key={index}>
                                            {Object.values(row).map((column, index) => (
                                                <TableCell
                                                    className={cn(
                                                        "table-cell zexa-font-normal",
                                                        column && column.toString().length > 55 && `zexa-min-w-[450px]`,
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
                            {/* <div className="zexa-border-t zexa-py-2 zexa-w-full">
                                <Button onClick={handleViewCharts} className="zexa-font-normal">
                                    Visualise Results
                                </Button>
                            </div> */}
                        </>
                    )}
                </div>
            </TableStyle>
        </div>
    );
};
