import React from "react";

import { EditorInfo } from "./EditorInfo";
import type { Editor } from "@tiptap/core";
import { TemplateSave } from "./TemplateSave";

import { Icon } from "@/components/ui/Icon";
import { Toolbar } from "@/components/ui/Toolbar";
import { Button } from "@/components/ui/ButtonAlt";
import Tooltip from "@/components/ui/TooltipAlt";

export type EditorHeaderProps = {
    isSidebarOpen?: boolean;
    toggleSidebar?: () => void;
    characters: number;
    words: number;
    editor: Editor;
};

export const EditorHeader = ({ characters, words, isSidebarOpen, toggleSidebar, editor }: EditorHeaderProps) => {
    return (
        <div className="flex flex-row items-center justify-between flex-none py-2 pl-6 pr-3 text-black bg-white border-b border-neutral-200 dark:bg-black dark:text-white dark:border-neutral-800">
            <div className="flex flex-row gap-x-4 items-center">
                <Toolbar.Button
                    tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                    onClick={toggleSidebar}
                    active={isSidebarOpen}
                    className={isSidebarOpen ? "bg-transparent" : ""}
                >
                    <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
                </Toolbar.Button>
                <EditorInfo characters={characters} words={words} />
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
                <TemplateSave editor={editor} />
            </div>
        </div>
    );
};
