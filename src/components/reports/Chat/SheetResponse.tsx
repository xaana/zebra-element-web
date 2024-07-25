import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CollaboraExports } from '@/plugins/reports/hooks/useCollabora';
import React from 'react';

const SheetResponse = (
    {result,
    cells,
    editor}: 
    {result: any;
    cells: {[key:string]:string}; 
    editor: CollaboraExports}): 
    JSX.Element => {
    const [showButton, setShowButton] = React.useState(true);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const handleInsert = async ():Promise<void> => {
        editor.insertCells(cells)
        setShowButton(false);
        // const selectedCell = await editor.fetchSelectedCells();
        // if(!selectedCell) return;
        // if (Object.keys(selectedCell).length > 1) {
        //     const keys = Object.keys(selectedCell);
        //     if (selectedCell[keys[0]]==='') {
        //         editor.insertCells({[keys[0]]:text});
        //         setShowButton(false);
        //     }else{
        //         setDescription("Cell already filled, are you sure you want to overwrite it?");
        //         setDialogOpen(true);
        //     }
        // }
        // if (Object.keys(selectedCell).length === 1) {
        //     const keys = Object.keys(selectedCell);
        //     if (selectedCell[keys[0]]==='') {
        //         editor.insertCells({[keys[0]]:text});
        //         setShowButton(false);
        //     }else{
        //         setDescription("Cell already filled, are you sure you want to overwrite it?");
        //         setDialogOpen(true);
        //     }
            
        // }
        // if (Object.keys(selectedCell).length === 0) {
        //     setDescription("No cell selected, please select a cell and try again");
        //     setDialogOpen(true);
        // }
    }
    const handleDialogOpenChange = async (open: boolean): Promise<void> => {
        if (open) {
            setDialogOpen(open);
        } else {
            setDialogOpen(false);
        }
    };
    // const handleOverwrite = async (): Promise<void> => {
    //     const selectedCell = await editor.fetchSelectedCells();
    //     if (!selectedCell) return;
    //     const keys = Object.keys(selectedCell);
    //     editor.insertCells({[keys[0]]:answer});
    //     setShowButton(false);
    // }


    return (
        <div className='flex flex-col gap-y-4'>
            {Object.keys(result).map((key) => {
                return (
                    <div className='gap-y-2'> 
                        <div className='flex flex-col gap-y-2'>
                            <b>{key}</b>
                            <p>{result[key]}</p>
                        </div>
                {/* {showButton&&<Button onClick={() => handleInsert(answer)}>Insert</Button>} */}
                    </div>
                )
            })}
            {showButton&&<Button onClick={() => handleInsert()}>Insert</Button>}
        </div>
    );
    }

export default SheetResponse;
// {/* <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
//     <DialogContent>
//         <DialogHeader>
//             <DialogTitle>Insert Cell</DialogTitle>
//             <DialogDescription>{description}</DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//             {/* <Button variant="outline" onClick={() => setDialogOpen(false)}>
//                 Cancel
//             </Button> */}
//             <Button 
//             onClick={() => {
//                 setDialogOpen(false);
//                 handleOverwrite();
//             }}>
//                 OK
//             </Button>
//         </DialogFooter>
//     </DialogContent>
// </Dialog> */}