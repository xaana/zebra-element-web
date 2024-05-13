import React from "react";

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "../ui/dialog";
import Editor from "./Editor";

const EditorDialog = (props: {
    trigger?: React.JSX.Element
    onDestroyCallback?: (data:string)=>void
    onSendCallback: (content: string, rawContent:string)=>void
}):React.JSX.Element => {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {props.trigger ?? (<Button>
                    Open
                </Button>)}
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] p-0 overflow-hidden">
                <Editor
                    onDestroyCallback={props.onDestroyCallback}
                    onCancelCallback={()=>{setOpen(false)}}
                    onSendCallback={props.onSendCallback}
                />
            </DialogContent>
        </Dialog>
    )
}

export default EditorDialog;
