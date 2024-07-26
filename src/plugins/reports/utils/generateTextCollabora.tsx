import React from "react";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { Chat } from "@/plugins/reports/hooks/use-chat";
import { CollaboraExports } from "@/plugins/reports/hooks/useCollabora";
import { ResponseActionCollabora } from "@/components/reports/Chat/response-action-collabora";
import { markdownToHtml } from "@/lib/utils/markdownToHtml";
import SheetResponse from "@/components/reports/Chat/SheetResponse";
import { Button } from "@/components/ui/button";
import TableMessage, { Data } from "@/components/reports/Chat/TableMessage";
import ImageMessage from "@/components/reports/Chat/ImageMessage";

export const generateText = async (
    task: string,
    textSelection: string | undefined,
    editorChat: Chat,
    editor: CollaboraExports,
    tone?: string,
): Promise<void> => {
    // If to-from range is still empty after selecting parent node
    if (!textSelection || textSelection.length === 0) {
        // toast.error("Please select some text and try again.");
        await editorChat.appendMessage(
            "Please select some text and try again.",
            "system",
            false,
            null,
            false,
            false,
            true,
        );
        return;
    }

    // Text selection successfull, append task to chat
    await editorChat.appendMessage(
        `${task}: "${textSelection.slice(0, 20)}..."`,
        "user",
        false,
        null,
        false,
        false,
        true,
    );

    // Generate text from backend
    try {
        const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/text`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: textSelection,
                task,
                tone: tone || "",
                user_id: SettingsStore.getValue("userId"),
            }),
        });

        if (!res.body) {
            throw new Error("No ReadableStream received");
        }

        const reader: ReadableStreamDefaultReader = res.body.getReader();

        const onResponseComplete = (response: string): void => {
            editorChat.setMessages((prev) =>
                prev.map((message, index) => ({
                    ...message,
                    children:
                        index === prev.length - 1 ? (
                            <ResponseActionCollabora
                                editor={editor}
                                originalText={textSelection}
                                responseText={response}
                            />
                        ) : null,
                })),
            );
            // Insert plain text response
            // editor.insertText(response, false);

            // Insert markdown->html converted response
            markdownToHtml(response)
                .then((html) => {
                    editor.insertCustomHtml(html);
                })
                .catch((error) => {
                    console.error("Error while converting md to html:", error);
                });
        };

        reader &&
            editorChat.processStream(
                reader, // reader
                onResponseComplete, // onComplete
            );
    } catch (errPayload: any) {
        const errorMessage = errPayload?.response?.data?.error;
        const message = errorMessage !== "An error occurred" ? `An error has occured: ${errorMessage}` : errorMessage;
        console.error(message);
    }
};

export const generateSheetText = async (
    selectedCells:{[key:string]:string},
    task: string,
    questions: string[],
    editorChat: Chat,
    editor: CollaboraExports,
    questionQuery: boolean,
): Promise<void> => {
    // Text selection successfull, append task to chat
    await editorChat.appendMessage(
        `${task}: "${questions.join(", ").slice(0, 50)}..."`,
        "user",
        false,
        null,
        false,
        false,
        true,
    );
    if (!questionQuery){
        await editorChat.appendMessage(
            "Please only select a single column or cell.",
            "system",
            false,
            null,
            false,
            false,
            true,
        );
        return
    }

    // Generate text from backend
    try {
        await editorChat.appendMessage(
            "Generating...",
            "system",
            true,
            null,
            false,
            false,
            true,
        );
        const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/data_filling`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: JSON.stringify(selectedCells),
                question:task,
                // user_id: SettingsStore.getValue("userId"),
            }),
        });
        
        if (res.ok) {
            editorChat.setMessages((prev)=>prev.filter((message)=>(message.id!==editorChat.lastSystemMessageId.current)));
            await editorChat.appendMessage(
                "Inserting...",
                "system",
                true,
                null,
                false,
                false,
                true,
            );
            const response = await res.json();
            const result = response
            const status = await editor.insertCells(result)
            console.log(status)
            if (status.success){
                editorChat.setMessages((prev)=>prev.filter((message)=>(message.id!==editorChat.lastSystemMessageId.current)));
                await editorChat.appendMessage(
                    "Inserted!",
                    "system",
                    false,
                    null,
                    false,
                    false,
                    true,
                );
            }
            else{
                editorChat.setMessages((prev)=>prev.filter((message)=>(message.id!==editorChat.lastSystemMessageId.current)));
                await editorChat.appendMessage(
                    "Failed to insert, please try again.",
                    "system",
                    false,
                    null,
                    false,
                    false,
                    true,
                );
            }
            // const answers:{[key:string]:string} = {}
            // Object.keys(selectedCells).forEach((key)=>{
            //      const nextCol:string = nextColumn(key);
            //      const q = selectedCells[key];
            //      if (result[q]){
            //         answers[nextCol] = result[q];
            //      }
            // })
            // const children = 
            // <div>
            //     {Object.keys(response.result).map((key) => {
            //         return(
            //         <SheetResponse question={key} answer={response.result[key]} editor={editor} />)
            //     })}
            //     <Button onClick={() => {}}>Insert</Button>
            // </div>
            // if (response.result){
            //     await editorChat.appendMessage(
            //         "",
            //         "system",
            //         false,
            //         <SheetResponse result={response.result} cells={answers} editor={editor} />,
            //         false,
            //         false,
            //         true,
            //     );
            // }
            // else{
            //     throw new Error(await res.text());
            // }
            
        }
        else{
            editorChat.setMessages((prev)=>prev.filter((message)=>(message.id!==editorChat.lastSystemMessageId.current)));
            await editorChat.appendMessage(
                "Error while generating, please try again",
                "system",
                false,
                null,
                false,
                false,
                true,
            );
            throw new Error(await res.text());
        }
    } catch (errPayload: any) {
        const errorMessage = errPayload?.response?.data?.error;
        const message = errorMessage !== "An error occurred" ? `An error has occured: ${errorMessage}` : errorMessage;
        editorChat.setMessages((prev)=>prev.filter((message)=>(message.id!==editorChat.lastSystemMessageId.current)));
        await editorChat.appendMessage(
            "Error while generating, please try again",
            "system",
            false,
            null,
            false,
            false,
            true,
        );
        console.error(message);
    }
};

export const generateDataQuery = async (
    selectedCells:{[key:string]:string},
    task: string,
    editorChat: Chat,
    editor: CollaboraExports,
    questionQuery: boolean,
): Promise<void> => {
    // Text selection successfull, append task to chat
    await editorChat.appendMessage(
        `${task}`,
        "user",
        false,
        null,
        false,
        false,
        true,
    );
    // Generate text from backend
    try {
        await editorChat.appendMessage(
            "Generating...",
            "system",
            true,
            null,
            false,
            false,
            true,
        );
        const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/data_query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: JSON.stringify(selectedCells),
                task,
                // user_id: SettingsStore.getValue("userId"),
            }),
        });
        
        if (res.ok) {
            editorChat.setMessages((prev)=>prev.filter((message)=>(message.id!==editorChat.lastSystemMessageId.current)));
            const response = await res.json();
            const result = response.result
            const type = response.type
            
            if (response.result){
                if (type==="string"){
                    await editorChat.appendMessage(
                        result,
                        "system",
                        false,
                        null,
                        false,
                        false,
                        true,
                    );
                }else if (type==="json"){
                    const tableData:Data[] = JSON.parse(result);
                    if(tableData&&tableData.length>0){
                        await editorChat.appendMessage(
                            "Data for your question: "+task,
                            "system",
                            false,
                            <TableMessage tableData={tableData.slice(0,10)} />,
                            false,
                            false,
                            true,
                        );
                    }
                }
                else if(type ==="chart"){
                    console.log('image data',result)
                    await editorChat.appendMessage(
                        "Data for your question: "+task,
                        "system",
                        false,
                        <ImageMessage imageData={result} editor={editor} />,
                        false,
                        false,
                        true,
                    );
                }
                
            }
            else{
                throw new Error(await res.text());
            }
            
        }
        else{
            editorChat.setMessages((prev)=>prev.filter((message)=>(message.id!==editorChat.lastSystemMessageId.current)));
            await editorChat.appendMessage(
                "Error while generating, please try again",
                "system",
                false,
                null,
                false,
                false,
                true,
            );
            throw new Error(await res.text());
        }
    } catch (errPayload: any) {
        const errorMessage = errPayload?.response?.data?.error;
        const message = errorMessage !== "An error occurred" ? `An error has occured: ${errorMessage}` : errorMessage;
        editorChat.setMessages((prev)=>prev.filter((message)=>(message.id!==editorChat.lastSystemMessageId.current)));
        await editorChat.appendMessage(
            "Error while generating, please try again",
            "system",
            false,
            null,
            false,
            false,
            true,
        );
        console.error(message);
    }
};


const columnToIndex= (column) =>{
    let index = 0;
    for (let i = 0; i < column.length; i++) {
        index = index * 26 + (column.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    return index;
}

const indexToColumn = (index)=> {
    let column = '';
    while (index > 0) {
        const remainder = (index - 1) % 26;
        column = String.fromCharCode('A'.charCodeAt(0) + remainder) + column;
        index = Math.floor((index - 1) / 26);
    }
    return column;
}

const nextColumn = (cellRef) => {
    const columnPart = cellRef.match(/[A-Z]+/)[0];
    const rowPart = cellRef.match(/\d+/)[0];
    const colNum = columnToIndex(columnPart);
    const nextColumnPart = indexToColumn(colNum + 1);
    return nextColumnPart + rowPart;
}
