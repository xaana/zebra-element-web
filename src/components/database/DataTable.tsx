import * as React from "react";
import styled from "styled-components";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "../../lib/utils";
type DataItem = {
    [key: string]: string | number | null | undefined;
};



export const DataTable = ({
    data,
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}:{data:DataItem[]}) => {

    return (
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
            </>
    );
};
