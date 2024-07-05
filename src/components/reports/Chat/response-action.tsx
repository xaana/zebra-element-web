import React, { useState, useRef } from "react";
import { Editor } from "@tiptap/react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Icon } from "@/components/ui/Icon";
import { useTextmenuCommands } from "@/components/rich-text-editor/menus/TextMenu/hooks/useTextmenuCommands";
export const ResponseAction = ({ editor }: { editor: Editor }): JSX.Element => {
    const [actionValue, setActionValue] = useState("suggested");
    const commands = useTextmenuCommands(editor);

    const handleToggleChange = (value: string): void => {
        if (value === "original") {
            commands.onUndo();
        } else if (value === "suggested") {
            commands.onRedo();
        } else {
            return;
        }
        setActionValue(value);
    };
    return (
        <div className="flex justify-end items-center">
            <ToggleGroup
                type="single"
                value={actionValue}
                onValueChange={(value) => handleToggleChange(value)}
                className="justify-start gap-2"
            >
                <ToggleGroupItem value="suggested" aria-label="Toggle suggested">
                    <Icon name="Sparkles" className="mr-1" />
                    Suggested
                </ToggleGroupItem>
                <ToggleGroupItem value="original" aria-label="Toggle original">
                    <Icon name="History" className="mr-1" />
                    Original
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};
