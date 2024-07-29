import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { CollaboraExports } from "@/plugins/reports/hooks/useCollabora";
import React from "react";

const ImageMessage = ({ imageData,editor }: { imageData: string; editor: CollaboraExports }): JSX.Element => {
    const [showButton, setShowButton] = React.useState(true);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [insertType, setInsertType] = React.useState<"New Sheet (Data Display)"|"Current Sheet">("New Sheet (Data Display)");
    const handleInsert = () => {
        editor.sendMessage(
            {
                MessageId: "CallPythonScript",
                ScriptFile: "CreateNewSheet.py", // Ensure this Python script is deployed on the server
                Function: "insertImage",
                Values: {
                    base64_image: { type: "string", value: imageData},
                    insert_type: { type: "string", value: insertType==="New Sheet (Data Display)"? "New":"Current"},
                },
            },true
        )?.then((data) => {
            if (data.result.value==="ok"){
                setShowButton(false);
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    const handleDialogOpenChange = async (open: boolean): Promise<void> => {
        if (open) {
            setDialogOpen(open);
        } else {
            setDialogOpen(false);
        }
    };
    return (
        <>
            {/* Render the image using an img tag */}
            <img src={`data:image/png;base64,${imageData}`} alt="Image" />
            {showButton&&<Button onClick={() => handleDialogOpenChange(true)}>Insert</Button>}
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>Insert Chart</DialogTitle>
                    <DialogDescription>Where do you want to insert the Chart?</DialogDescription>
                    </DialogHeader>
                    <RadioGroup
                        defaultValue={insertType}
                        onValueChange={(value: string) => setInsertType(value as "New Sheet (Data Display)"|"Current Sheet")}
                        orientation="horizontal"
                        className="flex flex-row gap-4"
                    >
                        <div className="flex items-center space-x-1">
                            <RadioGroupItem value="New Sheet (Data Display)" id="r1" />
                            <Label htmlFor="r1">New Sheet (Data Display)</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                            <RadioGroupItem value="Current Sheet" id="r2" />
                            <Label htmlFor="r2">Current Sheet</Label>
                        </div>
                    </RadioGroup>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                        </Button>
                        <Button 
                            onClick={() => {
                                setDialogOpen(false);
                                handleInsert();
                            }}>
                                OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
        );
    };

export default ImageMessage;
