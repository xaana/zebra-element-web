import React from "react";

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import Editor from "./editor";

const EditorDialog = (props: {
    onToggleOpenCallback?: (open:boolean)=>void,
    onDestroyCallback?: (data:string)=>void
}):React.JSX.Element => {
    const [open, setOpen] = React.useState(false);

    const onToggleOpenHandler = ():void => {
        const curr = open;
        setOpen(!!curr)
        props.onToggleOpenCallback && props.onToggleOpenCallback(open);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button onClick={onToggleOpenHandler}>
                    Open
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] p-0 overflow-hidden">
                <Editor onDestroyCallback={props.onDestroyCallback} />
            </DialogContent>
        </Dialog>
    )
}

export default EditorDialog;
