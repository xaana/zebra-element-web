import React, { useRef, useState } from "react";
import { Separator } from "@radix-ui/react-separator";

import { EditorInfo } from "./EditorInfo";
import type { Editor } from "@tiptap/react";
import { ReportViewer } from "../ReportViewer";
import { ShareReport } from "../ShareReport";

import { Icon } from "@/components/ui/Icon";
import { Toolbar } from "@/components/ui/Toolbar";
import { Button } from "@/components/ui/ButtonAlt";
import Tooltip from "@/components/ui/TooltipAlt";
import { Toggle } from "@/components/ui/toggle";
import { IconZebra } from "@/components/ui/icons";
import { Report } from "@/plugins/reports/types";
import RingLoader from "@/components/ui/ring-loader";

export type EditorHeaderProps = {
    isLeftSidebarOpen?: boolean;
    isRightSidebarOpen?: boolean;
    toggleLeftSidebar?: () => void;
    toggleRightSidebar?: () => void;
    editor: Editor;
    onGoBack: () => void;
    onUpdateName: (name: string) => Promise<boolean>;
    selectedReport: Report;
};

export const EditorHeader = ({
    isLeftSidebarOpen,
    isRightSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
    editor,
    onGoBack,
    selectedReport,
    onUpdateName,
}: EditorHeaderProps): JSX.Element => {
    const characterCount = editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
    };

    const originalName = useRef(selectedReport.name);
    const [nameValue, setNameValue] = useState(selectedReport.name);
    const [isLoading, setIsLoading] = useState(false);

    const handleNameUpdate = async (): Promise<void> => {
        setIsLoading(true);
        let result;
        if (originalName.current !== nameValue) {
            result = await onUpdateName(nameValue);
        }
        if (result) {
            originalName.current = nameValue;
        } else {
            setNameValue(originalName.current);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-row items-center justify-between flex-none">
            <div className="flex-1 flex flex-row gap-x-0 items-center">
                <Toolbar.Button tooltip="Reports Home" onClick={onGoBack}>
                    <Icon name="ArrowLeftToLine" />
                </Toolbar.Button>
                <Toolbar.Button
                    tooltip={isLeftSidebarOpen ? "Close sidebar" : "Open sidebar"}
                    onClick={toggleLeftSidebar}
                    active={isLeftSidebarOpen}
                    className={isLeftSidebarOpen ? "bg-transparent" : ""}
                >
                    <Icon name={isLeftSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
                </Toolbar.Button>
                <div className="ml-4">
                    <EditorInfo characters={characterCount.characters()} words={characterCount.words()} />
                </div>
                <div className="flex-1 flex items-center">
                    <Separator orientation="vertical" className="w-[1px] h-10 bg-muted mx-4 my-0" />
                    <input
                        className="flex-1 text-lg xl:!text-xl !m-0 !text-foreground mr-2 !bg-transparent !p-1 !leading-none !transition-all !border !border-transparent focus:!border-primary hover:!border-secondary focus:!outline-none"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onBlur={async (e) => await handleNameUpdate()}
                        // placeholder={selectedReport.name}
                        type="text"
                    />
                    {isLoading && <RingLoader />}
                    {/* <div className="text-lg">{selectedReport.name}</div> */}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Tooltip title="Undo" shortcut={["⌘Z"]}>
                        <Button
                            variant="tertiary"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().chain().focus().undo().run()}
                        >
                            <Icon name="Undo" />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Redo" shortcut={["⌘Y"]}>
                        <Button
                            variant="tertiary"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().chain().focus().redo().run()}
                        >
                            <Icon name="Redo" />
                        </Button>
                    </Tooltip>
                </div>
                <Toggle
                    aria-label="Toggle bold"
                    size="sm"
                    // onClick={toggleRightSidebar}
                    className="relative"
                    pressed={isRightSidebarOpen}
                    onPressedChange={(pressed: boolean) => toggleRightSidebar && toggleRightSidebar()}
                >
                    <IconZebra className="h-6 w-6 fill-primary dark:fill-white" />
                </Toggle>
                <ReportViewer editor={editor} />
                <ShareReport report={selectedReport} />
            </div>
        </div>
    );
};
