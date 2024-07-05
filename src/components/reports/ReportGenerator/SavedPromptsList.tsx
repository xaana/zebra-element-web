import React, { useState } from "react";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { toast } from "sonner";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconStarFilled } from "@/components/ui/icons";

export type SavedPrompt = { id: number; text: string; outlineItems: string[] };

export const SavedPromptsList = ({
    savedPrompts,
    setSavedPrompts,
    setPrompt,
    setOutlineItems,
    onLoadSavedPrompt,
}: {
    savedPrompts: SavedPrompt[];
    setSavedPrompts: React.Dispatch<React.SetStateAction<SavedPrompt[]>>;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
    setOutlineItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
    onLoadSavedPrompt: (prompt: SavedPrompt) => void;
}): JSX.Element => {
    const [currentPage, setCurrentPage] = useState(1);
    const promptsPerPage = 6;

    const indexOfLastPrompt = currentPage * promptsPerPage;
    const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
    const currentPrompts = savedPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);

    const totalPages = Math.ceil(savedPrompts.length / promptsPerPage);

    const handleDeletePrompt = async (promptId: number): Promise<void> => {
        try {
            const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/delete_prompt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt_id: promptId,
                }),
            });
            if (res.ok) {
                setSavedPrompts((prev) => prev.filter((p) => p.id !== promptId));
            } else {
                toast.error("Failed to delete prompt. Please try again later.", { closeButton: true });
            }
        } catch (errPayload: any) {
            toast.error("Failed to delete prompt. Please try again later.", { closeButton: true });
            console.error(errPayload);
        }
    };

    const nextPage = (): void => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = (): void => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div>
            <div className="w-full flex items-center justify-center gap-1">
                <IconStarFilled className="h-5 w-5 text-primary-900" />
                <div className="text-lg font-semibold text-center">Saved Prompts</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2">
                {currentPrompts.map((prompt, index) => (
                    <div
                        key={index}
                        onClick={() => onLoadSavedPrompt(prompt)}
                        className="min-h-24 flex justify-between items-start gap-2 cursor-pointer bg-background rounded-sm p-3 transition-all outline-none hover:outline-accent hover:-outline-offset-2"
                    >
                        <div className="flex gap-2 items-start">
                            <div className="shrink-0 flex flex-col gap-2">
                                <Icon name="MessageSquare" className="w-4 h-4 text-primary-default" />
                                {prompt.outlineItems.length > 0 && (
                                    <Icon name="List" className="w-4 h-4 text-primary-default" />
                                )}
                            </div>
                            <div className="flex-1 text-sm -mt-0.5 w-full max-h-24 overflow-hidden">
                                <div className="w-full max-h-24 overflow-auto scrollbar--custom">{prompt.text}</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0 -mt-0.5">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-auto h-auto p-1 rounded-full"
                                        onClick={(e: any) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeletePrompt(prompt.id);
                                        }}
                                    >
                                        <Icon name="Trash2" className="w-3 h-3 text-red-400" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-2">
                    <Button
                        variant="link"
                        className="text-xs text-muted-foreground"
                        size="sm"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                    >
                        <Icon name="ChevronLeft" className="w-3 h-3 mr-1" />
                        Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {currentPage}/{totalPages}
                    </span>
                    <Button
                        variant="link"
                        className="text-xs text-muted-foreground"
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <Icon name="ChevronRight" className="w-3 h-3 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
};
