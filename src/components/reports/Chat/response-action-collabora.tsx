import React, { useState } from "react";

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

    const handleToggleChange = (value: string): void => {
        if (value === "original") {
            editor.insertTextandSelect(originalText);
        } else if (value === "suggested") {
            editor.insertTextandSelect(responseText);
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
