import React, { useRef, useState } from "react";

import { ChatSidebarCollabora } from "../Chat/ChatSidebarCollabora";
import SuggestedPromptsCollabora from "../Chat/suggested-prompts-collabora";

import { cn } from "@/lib/utils";
import { Loader } from "@/components/ui/LoaderAlt";
import { Chat, useChat } from "@/plugins/reports/hooks/use-chat";
import DataQuerySidebar from "@/components/reports/CollaboraEditor/DataQuerySidebar";
import DocQuerySidebar from "@/components/reports/CollaboraEditor/DocQuerySidebar";
import { useCollabora } from "@/plugins/reports/hooks/useCollabora";
import { generateDataQuery, generateSheetText, generateText } from "@/plugins/reports/utils/generateTextCollabora";
import { Message, Report } from "@/plugins/reports/types";
import { generateSheetResultFromSoma } from "@/plugins/reports/utils/generateEditorContent";

const CollaboraEditor = ({
    selectedReport,
    onCloseEditor,
    onDocumentLoadFailed,
    currentUser,
    allUsers,
}: {
    selectedReport: Report;
    onCloseEditor: () => void;
    onDocumentLoadFailed: () => void;
    currentUser: string;
    allUsers: string[];
}): JSX.Element => {
    const editorRef = useRef<HTMLIFrameElement>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const handlePromptClick = useRef<undefined | ((prompt: string) => Promise<void>)>();
    const [isAiLoading, setIsAiLoading] = useState(false);

    const chatInitialMessage: Message = (selectedReport.fileType === "docx"||selectedReport.fileType === "doc") ? {
        id: "0",
        role: "system",
        content: `👋 Hi, I'm your AI writing partner. Select some text and then type below to have me change it.`,
        children: <SuggestedPromptsCollabora onPromptClick={handlePromptClick} />,
    }:{
        id: "0",
        role: "system",
        content: `👋 Hi, I'm your AI writing partner. Select some cells and then type below to ask me to process it.`,
        children: <></>,
    };

    const chat: Chat = useChat({
        initialMessages: [chatInitialMessage],
        isOpen: showSidebar,
        open: () => setShowSidebar(true),
        close: () => setShowSidebar(false),
        toggle: () => setShowSidebar((prev) => !prev),
    });

    const editor = useCollabora({
        iframeRef: editorRef,
        selectedReport,
        showSidebar,
        setShowSidebar,
        onCloseEditor,
        onDocumentLoadFailed,
        setIsAiLoading,
        currentUser,
        allUsers,
    });

    handlePromptClick.current = async (prompt: string): Promise<void> => {
        const selectedText = await editor.fetchSelectedText();
        await generateText(prompt, selectedText, chat, editor);
    };
    const changeSingleColumnOrRow = (cells:string[]):boolean => {
        const column = []
        const row = []
        for (let i = 0; i < cells.length; i++) {
            const cellRef = cells[i];
            const columnPart = cellRef.match(/[A-Z]+/)[0];
            const rowPart = cellRef.match(/\d+/)[0];
            column.push(columnPart)
            row.push(rowPart)
        }
        if (areAllStringsEqual(column)||areAllStringsEqual(row)){
            return true
        }
        return false        
        
    }
    const areAllStringsEqual = (strings:string[]): boolean => {
        if (strings.length === 0) return true; // Optionally handle empty array as true or false based on requirements
        const firstString = strings[0];
        for (let i = 1; i < strings.length; i++) {
            if (strings[i] !== firstString) {
                return false;
            }
        }
        return true;
    }

    const handleQueryFormSubmit = async (): Promise<void> => {
        if (chatInput.length === 0 || !chat) return;
        const inputText = chatInput;
        setChatInput("");
        const type = selectedReport.fileType.toLowerCase(); 
        let selectedText:string|undefined = "";
        if (type==="docx" || type==="doc") {
            selectedText = await editor.fetchSelectedText();
        }else if (type==="xlsx" || type === "xls") {
            const selectedCells = await editor.fetchSelectedCells();
            if (!selectedCells) return
            const questionQuery = changeSingleColumnOrRow(Object.keys(selectedCells))
            const questions:string[] = []
            Object.keys(selectedCells).forEach((key:string) => {
                if (selectedCells[key]!==""){
                    questions.push(selectedCells[key])
                }
            })
            if (questions.length===0) {
                await chat.appendMessage(
                    "No text found in selected cells, please select a column of cells and try again.",
                    "system",
                    false,
                    null,
                    false,
                    false,
                    true,
                );
            }
            if (questionQuery){
                await generateSheetText(selectedCells,inputText,questions,chat, editor,questionQuery);
            }else{
                await generateDataQuery(selectedCells,inputText,chat, editor,questionQuery);
            }
            
            
            // if(res){
            //     const results = res.split("$_$");
            //     const keys = Object.keys(selectedCells).map((key)=>{
            //         return nextColumn(key)
            //     })
            //     keys.forEach((key,index)=>{
            //         editor.insertCells({[key]:results[index]})
            //     })
            // }
            return
        }
        if (type === "docx" || type === "doc") {
            await generateText(inputText, selectedText, chat, editor);
        }
    };

    return (
        <>
            {(isAiLoading || !editor.documentLoaded) && (
                <Loader label={isAiLoading ? "Zebra is generating content..." : "Loading document..."} />
            )}
            <div className={cn("w-full h-full", editor.documentLoaded ? "flex" : "invisible")}>
                <div className="h-full flex-1">
                    <iframe
                        style={{ height: "100vh", width: "100%" }}
                        // className="flex-1"
                        ref={editorRef}
                        title="AlgoReports Editor"
                        id="algoReports-editor"
                        name="algoReports-editor"
                        allow="clipboard-read *; clipboard-write *"
                        src={editor.startLoading ? editor.wopiUrl : ""}
                    />
                </div>
                <div
                    className={cn(
                        "h-full transition-[width] overflow-y-hidden border-l w-0 shrink-0 bg-card",
                        showSidebar ? "w-[350px] visible" : "w-0 invisible",
                    )}
                >
                    {editor.zebraMode === "chat" ? (
                        <ChatSidebarCollabora
                            chat={chat}
                            chatInput={chatInput}
                            setChatInput={setChatInput}
                            onClose={() => {
                                setShowSidebar(false);
                                chat.reset();
                            }}
                            onQueryFormSubmit={handleQueryFormSubmit}
                        />
                    ) : editor.zebraMode === "doc" ? (
                        <DocQuerySidebar
                            editor={editor}
                            onClose={() => {
                                setShowSidebar(false);
                                editor.setZebraMode("chat");
                            }}
                        />
                    ) : (
                        <DataQuerySidebar
                            editor={editor}
                            onClose={() => {
                                setShowSidebar(false);
                                editor.setZebraMode("chat");
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default CollaboraEditor;
