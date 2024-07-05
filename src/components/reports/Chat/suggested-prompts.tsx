import React, { useContext } from "react";

import { Button } from "@/components/ui/button";
import { EditorContext } from "@/components/rich-text-editor/context/EditorContext";
import { generateText } from "@/plugins/reports/utils/generateText";
const prompts = [
    `Rewrite in a professional tone`,
    // `Underline all the nouns`,
    `Make it more concise`,
    `Add some emojis`,
    // `Format this as a table`,
];
const SuggestedPrompts = (): JSX.Element => {
    const { editorChat, editor } = useContext(EditorContext);
    const handlePromptClick = async (prompt: string): Promise<void> => {
        editor && editorChat && (await generateText(prompt, editor, editorChat));
    };

    return (
        <>
            <div className="text-sm mb-2 font-medium text-muted-foreground">Here are some ways I can help:</div>
            <ul className="flex flex-col gap-1">
                {prompts.map((prompt, index) => (
                    <li key={index}>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => await handlePromptClick(prompt)}
                            className="h-auto w-auto px-2 py-1"
                        >
                            {prompt}
                        </Button>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default SuggestedPrompts;
