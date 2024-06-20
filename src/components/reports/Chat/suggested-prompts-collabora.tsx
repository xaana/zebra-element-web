import React from "react";

import { Button } from "@/components/ui/button";
const prompts = [
    `Rewrite in a professional tone`,
    // `Underline all the nouns`,
    `Make it more concise`,
    `Add some emojis`,
    // `Format this as a table`,
];
const SuggestedPromptsCollabora = ({
    onPromptClick,
}: {
    onPromptClick: React.MutableRefObject<((prompt: string) => Promise<void>) | undefined>;
}): JSX.Element => {
    return onPromptClick.current ? (
        <>
            <div className="text-sm mb-2 font-medium text-muted-foreground">Here are some ways I can help:</div>
            <ul className="flex flex-col gap-1">
                {prompts.map((prompt, index) => (
                    <li key={index}>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => onPromptClick.current && (await onPromptClick.current(prompt))}
                            className="h-auto w-auto px-2 py-1"
                        >
                            {prompt}
                        </Button>
                    </li>
                ))}
            </ul>
        </>
    ) : (
        <></>
    );
};

export default SuggestedPromptsCollabora;
