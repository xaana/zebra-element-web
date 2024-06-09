import React from "react";

import { EditorInfo } from "./EditorInfo";
import type { Editor } from "@tiptap/core";

import { Icon } from "@/components/ui/Icon";
import { Toolbar } from "@/components/ui/Toolbar";
import { Button } from "@/components/ui/ButtonAlt";
import { Button as ButtonUI } from "@/components/ui/button";
import Tooltip from "@/components/ui/TooltipAlt";
import { Toggle } from "@/components/ui/toggle";
import { IconZebra } from "@/components/ui/icons";

export type EditorHeaderProps = {
    isLeftSidebarOpen?: boolean;
    isRightSidebarOpen?: boolean;
    toggleLeftSidebar?: () => void;
    toggleRightSidebar?: () => void;
    editor: Editor;
    onGoBack: () => void;
    generateReport: () => void;
};

export const EditorHeader = ({
    isLeftSidebarOpen,
    isRightSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
    editor,
    onGoBack,
    generateReport,
}: EditorHeaderProps): JSX.Element => {
    const characterCount = editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
    };
    return (
        <div className="flex flex-row items-center justify-between flex-none">
            <div className="flex flex-row gap-x-0 items-center">
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
                    {/* <Icon
            name='Sparkles'
            className='absolute top-1 right-1 h-[10px] w-[10px]'
          /> */}
                </Toggle>
                <ButtonUI onClick={generateReport} size="sm">
                    Generate Report
                    <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
                </ButtonUI>
            </div>
        </div>
    );
};
