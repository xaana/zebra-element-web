import { useEffect, useState } from "react";
import React from "react";
// import {WeatherWidget} from "@daniel-szulc/react-weather-widget"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { cn } from "../../lib/utils";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

type DataItem = {
    [key: string]: string | number | null | undefined;
};



export const DataTable = ({
    data,
    eventId,
    totalEntries,
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}:{data:DataItem[];eventId:string;totalEntries:string}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(Math.ceil(Number(totalEntries)/10));
    const [tableData, setTableData] = useState(data);
    console.log(eventId)
    useEffect(() => {
        if(currentPage!==1){
            fetchData(currentPage);
        }
        else{
            setTableData(data);
        }
        
      }, [currentPage]);

      const fetchData = async (page:number):Promise<void> => {
        // Fetch data from your backend; URL and method might change based on your backend setup
        const payload = {
            pageNum:page,
            eventId:eventId,
        };
        const url = `${SettingsStore.getValue("botApiUrl")}/db_pagination`;
        const request = new Request(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
        const response = await fetch(request);
        const data = await response.json();
        if(data.status==="success"){
            console.log(data.msg)
            setTableData(data.msg);
        }
        else{
            console.log('error get database data');
        }
        // setTotalPages based on response if needed
      };
    const getPageNumbers = (): any[] => {

        const pageNumbers = [];
        const visiblePages = 3; // You can adjust how many pages to show
      
        let startPage = Math.max(currentPage - 1, 1);
        let endPage = startPage + visiblePages - 1;
      
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = Math.max(endPage - visiblePages + 1, 1);
        }
      
        if (startPage > 1) {
          pageNumbers.push(1);
          if (startPage > 2) {
            pageNumbers.push('...');
          }
        }
      
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
      
        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            pageNumbers.push('...');
          }
          pageNumbers.push(totalPages);
        }
      
        return pageNumbers;
      };
      
      const handlePrevious = () => {
        setCurrentPage(currentPage - 1);
      };
    
      const handleNext = () => {
        setCurrentPage(currentPage + 1);
      };
    
      const handlePageClick = (page) => {
        setCurrentPage(page);
      };

    if(!tableData)return null


    return (
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
                {totalPages>1&&<div className="flex justify-end flex-col">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={handlePrevious}  className={currentPage === 1?"pointer-events-none text-gray-500 cursor-not-allowed":"cursor-pointer"} />
                            </PaginationItem>
                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={index} className="cursor-pointer">
                                {page === '...' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink onClick={() => handlePageClick(page)} isActive={currentPage === page}>
                                    {page}
                                    </PaginationLink>
                                )}
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext onClick={handleNext} className={currentPage === totalPages?"pointer-events-none text-gray-500 cursor-not-allowed":"cursor-pointer"} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div> } 
            </div>
    );
};
