import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { cn } from "@/lib/utils";
import { CollaboraExports } from "@/plugins/reports/hooks/useCollabora";
import React from "react"
export type Data = {
    [key: string]: string | number | null | undefined;
};


const TableMessage = ({tableData,editor}:{tableData:Data[];editor:CollaboraExports}):JSX.Element => {
    const [showButton,setShowButton] = React.useState(true)
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const handleOverwrite = async (): Promise<void> => {
        const selectedCell = await editor.fetchSelectedCells();
        if (!selectedCell) return;
        const keys = Object.keys(selectedCell);
        editor.insertTable(keys[0],JSON.stringify(tableData));
        setShowButton(false);
    }
    const handleDialogOpenChange = async (open: boolean): Promise<void> => {
        if (open) {
            setDialogOpen(open);
        } else {
            setDialogOpen(false);
        }
    };
    const handleInsert = async ():Promise<void> => {
        const selectedCell = await editor.fetchSelectedCells();
        if(!selectedCell) return;
        if (Object.keys(selectedCell).length > 1) {
            const keys = Object.keys(selectedCell);
            if (selectedCell[keys[0]]==='') {
                editor.insertTable(keys[0],JSON.stringify(tableData));
                setShowButton(false);
            }else{
                setDescription("Cell already filled, are you sure you want to overwrite it?");
                setDialogOpen(true);
            }
        }
        if (Object.keys(selectedCell).length === 1) {
            const keys = Object.keys(selectedCell);
            if (selectedCell[keys[0]]==='') {
                editor.insertTable(keys[0],JSON.stringify(tableData));
                setShowButton(false);
            }else{
                setDescription("Cell already filled, are you sure you want to overwrite it?");
                setDialogOpen(true);
            }
            
        }
        if (Object.keys(selectedCell).length === 0) {
            setDescription("No cell selected, please select a cell and try again");
            setDialogOpen(true);
        }
    }
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
                {showButton&&<Button onClick={() => handleInsert()}>Insert</Button>}

                <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Insert Cell</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                            onClick={() => {
                                setDialogOpen(false);
                                handleOverwrite();
                            }}>
                                OK
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
        </div>
    )
}

export default TableMessage