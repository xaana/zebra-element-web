import React from "react";
import Textarea from "react-textarea-autosize";

import PagesSelector from "./PagesSelector";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconStarAdd, IconStarFilled } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useEnterSubmit } from "@/plugins/reports/hooks/use-enter-submit";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

export const PromptInput = ({
    showOutline,
    pages,
    setPages,
    prompt,
    setPrompt,
    onSavePrompt,
    promptSaveStatus,
    onGenerateOutline,
}: {
    showOutline: boolean;
    pages: number;
    setPages: React.Dispatch<React.SetStateAction<number>>;
    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
    onSavePrompt: () => void;
    promptSaveStatus: string | undefined;
    onGenerateOutline: () => Promise<void>;
}): JSX.Element => {
    const { onKeyDown } = useEnterSubmit();
    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    return (
        <>
            <div
                className={cn(
                    "flex gap-4 w-full mt-10 mb-2 items-end",
                    showOutline ? "justify-between" : "justify-end",
                )}
            >
                {showOutline && (
                    <div className="text-muted-foreground font-semibold text-base translate-y-1">Prompt</div>
                )}
                <div className="flex items-end">
                    <PagesSelector pages={pages} setPages={setPages} />
                </div>
            </div>
            <div className="relative w-full">
                <Textarea
                    ref={inputRef}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    style={{ boxSizing: "border-box" }}
                    minRows={1}
                    maxRows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Describe what you'd like to create`}
                    spellCheck={false}
                    className="w-full resize-none py-2.5 pl-2.5 pr-12 mx-auto focus-within:outline-primary/60 bg-popover text-base border rounded-md max-w-screen-md"
                />
                {prompt.length > 0 && (
                    <div className="absolute right-2.5 top-2 flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-auto h-auto p-0 rounded-full z-10 mt-"
                                    onClick={onSavePrompt}
                                    disabled={promptSaveStatus === prompt}
                                >
                                    {promptSaveStatus && promptSaveStatus === prompt ? (
                                        <IconStarFilled className="w-6 h-6 text-primary-900" />
                                    ) : (
                                        <IconStarAdd className="w-6 h-6 text-primary-800" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Save Prompt</p>
                            </TooltipContent>
                        </Tooltip>
                        {showOutline && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="default"
                                        className="p-1.5 h-auto w-auto z-10 rounded-full"
                                        onClick={async () => {
                                            await onGenerateOutline();
                                        }}
                                    >
                                        <Icon name="RefreshCw" className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Regenerate Outline</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
