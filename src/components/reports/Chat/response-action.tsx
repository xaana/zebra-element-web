import React, { useState, useRef } from "react";
import { Editor } from "@tiptap/react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Icon } from "@/components/ui/Icon";
export const ResponseAction = ({
    fromPos,
    toPos,
    response,
    original,
    editor,
}: {
    fromPos: number;
    toPos: number;
    response: string;
    original: string;
    editor: Editor;
}): JSX.Element => {
    const [actionValue, setActionValue] = useState("suggested");
    const to = useRef<number>(toPos);
    const from = useRef<number>(fromPos);
    const responseText = useRef<string>(response);
    const textSelection = useRef<string>(original);
    const handleToggleChange = (value: string): void => {
        if (!value) return;
        setActionValue(value);
        if (responseText.current.length > 0) {
            // const node = editor.state.doc.nodeAt(from.current)
            // const nodeSize = node?.nodeSize
            editor.commands.deleteRange({ from: from.current, to: to.current });
            if (value === "original") {
                editor.commands.insertContentAt(from.current, textSelection.current);
                to.current = from.current + textSelection.current.length + 1;
            } else {
                editor.commands.insertContentAt(from.current, responseText.current);
                to.current = from.current + responseText.current.length + 1;
            }
            // editor.commands.selectParentNode()
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
