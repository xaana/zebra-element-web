import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils";
import React from "react"
export type Data = {
    [key: string]: string | number | null | undefined;
};


const TableMessage = ({tableData}:{tableData:Data[]}):JSX.Element => {
    return(
        <div>
            <Table>
                    <TableHeader>
                        <TableRow>
                            {Object.keys(tableData[0]).map((column, index) => (
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
                        {tableData.map((row, index) => (
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
                                                Object.keys(tableData[0])
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
        </div>
    )
}

export default TableMessage