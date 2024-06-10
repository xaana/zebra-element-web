import React, { useState, useRef } from "react";
import { Editor } from "@tiptap/react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Icon } from "@/components/ui/Icon";
export const ResponseAction = ({
    fromPos,
    originalToPos,
    newToPos,
    response,
    original,
    editor,
}: {
    fromPos: number;
    originalToPos: number;
    newToPos: number;
    response: string;
    original: string;
    editor: Editor;
}): JSX.Element => {
    const [actionValue, setActionValue] = useState("suggested");
    const from = useRef<number>(fromPos);
    const originalTo = useRef<number>(originalToPos);
    const newTo = useRef<number>(newToPos);
    const responseText = useRef<string>(response);
    const textSelection = useRef<string>(original);

    const handleToggleChange = (value: string): void => {
        if (!value) return;
        setActionValue(value);

        if (value === "original" && textSelection.current.length > 0) {
            editor.commands.insertContentAt({ from: from.current, to: newTo.current }, textSelection.current);
        } else if (value === "suggested" && responseText.current.length > 0) {
            editor.commands.insertContentAt({ from: from.current, to: originalTo.current }, responseText.current);
        }
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
