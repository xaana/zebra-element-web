import React, { useState } from "react";
import { toast } from "sonner";

import { CollaboraExports } from "@/plugins/reports/hooks/useCollabora";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Icon } from "@/components/ui/Icon";
export const ResponseActionCollabora = ({
    editor,
    originalText,
    responseText,
}: {
    editor: CollaboraExports;
    originalText: string;
    responseText: string;
}): JSX.Element => {
    const [actionValue, setActionValue] = useState("suggested");
    const [showToggle, setShowToggle] = useState(true);

    const handleToggleChange = async (value: string): Promise<void> => {
        const selectedText = await editor.fetchSelectedText();
        if (value === "original") {
            if (!selectedText || selectedText.length === 0 || selectedText.length !== responseText.length) {
                setShowToggle(false);
                toast.error(`No text selection found.`);
            } else {
                editor.insertTextandSelect(originalText);
            }
        } else if (value === "suggested") {
            if (!selectedText || selectedText.length === 0 || Math.abs(selectedText.length - originalText.length) > 5) {
                setShowToggle(false);
                toast.error(`No text selection found.`);
            } else {
                editor.insertTextandSelect(responseText);
            }
        } else {
            return;
        }
        setActionValue(value);
    };
    return showToggle ? (
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
    ) : (
        <></>
    );
};
