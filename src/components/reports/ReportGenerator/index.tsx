import React from "react";
import Textarea from "react-textarea-autosize";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { toast, Toaster } from "sonner";
import styled from "styled-components";

import SamplePrompts from "./SamplePrompts";
import PagesSelector from "./PagesSelector";
import HeaderText from "./HeaderText";
import Outline from "./Outline";
import OutlineSettings from "./OutlineSettings";
import type { MatrixFile } from "@/plugins/files/types";
import { AdvancedOptions } from "./AdvancedOptions";
import { SavedPrompt, SavedPromptsList } from "./SavedPromptsList";

import { IconStarAdd, IconStarFilled, IconZebra } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEnterSubmit } from "@/plugins/reports/hooks/use-enter-submit";
import { SwitchSlideTransition } from "@/components/ui/transitions/switch-slide-transition";
import { FadeTransition } from "@/components/ui/transitions/fade-transition";
import { cn } from "@/lib/utils";
import { Report } from "@/plugins/reports/types";
import { Separator } from "@/components/ui/separator";

const ModalStyle = styled.div`
    .element {
        position: relative;
        z-index: 1;
    }

    .element::before {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background: linear-gradient(45deg, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 0.5));
        z-index: -1;
        filter: blur(10px); /* Adjust the blur to simulate shadow */
    }
`;

export const ReportGenerator = ({
    onReportGenerate,
    allReports,
    userId,
}: {
    onReportGenerate: (
        documentPrompt: string,
        allTitles: string[],
        contentSize: string,
        tone: string,
        targetAudience: string,
        contentMediaIds?: string[],
        selectedTemplateId?: string,
    ) => void;
    allReports: Report[];
    userId: string;
}): JSX.Element => {
    const { onKeyDown } = useEnterSubmit();
    const [prompt, setPrompt] = React.useState("");
    const [pages, setPages] = React.useState(4);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [showOutline, setShowOutline] = React.useState(false);
    const [isOutlineLoading, setIsOutlineLoading] = React.useState(false);
    const [outlineItems, setOutlineItems] = React.useState<string[]>();
    const [savedPrompts, setSavedPrompts] = React.useState<SavedPrompt[]>([]);
    const [promptSaveStatus, setPromptSaveStatus] = React.useState<string>();
    const [contentSize, setContentSize] = React.useState<string>("medium");
    const [targetAudience, setTargetAudience] = React.useState<string>("");
    const [contentFiles, setContentFiles] = React.useState<MatrixFile[]>([]);
    const [contentMediaIds, setContentMediaIds] = React.useState<string[]>([]);
    const [tone, setTone] = React.useState<string>("");
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const promptsRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>();

    const handleGenerateOutline = async (customOutlineItems?: string[]): Promise<void> => {
        const mediaIdRegexPattern = /\w+:\/\/\w+\.\w+\/(\w+)/;
        const mediaIds = contentFiles
            .map((file) => file.mediaId)
            .map((mediaId) => {
                const match = mediaIdRegexPattern.exec(mediaId);
                return match ? match[1] : null;
            })
            .filter(Boolean) as string[];
        setContentMediaIds(mediaIds);

        setIsOutlineLoading(true);
        setShowOutline(true);
        if (!customOutlineItems) {
            try {
                const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/outlines`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        request: prompt,
                        pages_count: pages,
                        ...(mediaIds.length > 0 && { content_media_ids: mediaIds }),
                    }),
                });
                const data = await res.json();
                setOutlineItems(data);
            } catch (errPayload: any) {
                const errorMessage = errPayload?.response?.data?.error;
                const message =
                    errorMessage !== "An error occurred" ? `An error has occured: ${errorMessage}` : errorMessage;
                console.error(message);
                setShowOutline(false);
            }
        }
        setIsOutlineLoading(false);
    };

    const fetchSavedPrompts = async (): Promise<void> => {
        try {
            const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/get_prompts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                }),
            });
            const data = await res.json();
            if (data && data.status && data.prompts) {
                setSavedPrompts(() =>
                    data.prompts.map((p: any) => {
                        return { id: p.id, text: p.prompt_text, outlineItems: p.outline_items ?? [] } as SavedPrompt;
                    }),
                );
            }
        } catch (errPayload: any) {
            console.error(errPayload);
        }
    };

    const handleSavePrompt = async (): Promise<void> => {
        const promptText = prompt;
        try {
            const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/store_prompt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    prompt_text: promptText,
                    ...(outlineItems && outlineItems.length > 0 && { outline_items: outlineItems }),
                }),
            });
            const data = await res.json();
            if (res.ok && data.status && data.prompt_id) {
                setSavedPrompts((prev) => [
                    ...prev,
                    { id: data.prompt_id, text: promptText, outlineItems: outlineItems ?? [] },
                ]);
                toast.success("Prompt saved successfully.", { closeButton: true });
                setPromptSaveStatus(promptText);
                !showOutline && setPrompt("");
            } else {
                toast.error("Failed to save prompt. Please try again later.", { closeButton: true });
            }
        } catch (errPayload: any) {
            console.error(errPayload);
        }
    };

    const handleLoadSavedPrompt = async (prompt: SavedPrompt): Promise<void> => {
        setPrompt(prompt.text);
        if (prompt.outlineItems.length > 0) {
            setOutlineItems(prompt.outlineItems);
            await handleGenerateOutline(prompt.outlineItems);
        }
    };

    const handleDialogToggle = async (open: boolean): Promise<void> => {
        if (open) {
            setDrawerOpen(true);
            await fetchSavedPrompts();
        } else {
            setDrawerOpen(false);
            // Reset state
            setPages(4);
            setOutlineItems(undefined);
            setShowOutline(false);
            setContentSize("medium");
            setTargetAudience("");
            setTone("");
            setPrompt("");
            setSelectedTemplateId(undefined);
            setContentFiles([]);
            setContentMediaIds([]);
            setPromptSaveStatus(undefined);
        }
    };

    const handleGenerateReport = async (): Promise<void> => {
        setDrawerOpen(false);
        onReportGenerate(
            prompt,
            outlineItems ? outlineItems.filter(Boolean) : [],
            contentSize,
            tone.length > 0 ? tone : "neutral",
            targetAudience.length > 0 ? targetAudience : "general",
            contentMediaIds ?? [],
            selectedTemplateId ?? undefined,
        );
    };

    return (
        <Dialog open={drawerOpen} onOpenChange={handleDialogToggle}>
            <DialogTrigger asChild>
                <Button className="font-semibold text-sm" size="sm">
                    <div className="mr-2 relative overflow-visible">
                        <IconZebra className="w-5 h-5" />
                        <Icon name="Sparkles" className="absolute -top-1 -right-1 h-2 w-2 border-none" />
                    </div>
                    Create New
                </Button>
            </DialogTrigger>
            <ModalStyle>
                <DialogContent
                    className="element h-[90vh] w-[800px] max-w-[800px] overflow-hidden"
                    style={{
                        padding: "1.5px",
                        borderStyle: "none",
                        background:
                            "linear-gradient(90deg, var(--cpd-color-zebra-800) 0%, #d58fed 50%, var(--cpd-color-zebra-800) 100%)",
                        overflow: "visible",
                    }}
                >
                    <div
                        className="w-full h-full bg-card relative overflow-auto scrollbar--custom flex flex-col"
                        style={{ borderRadius: "6px" }}
                    >
                        <Toaster />
                        {showOutline && (
                            <div className="absolute top-2 left-2 z-20">
                                <Button
                                    className="w-auto h-auto p-2 text-muted-foreground"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setOutlineItems(undefined);
                                        setShowOutline(false);
                                    }}
                                >
                                    <Icon name="ArrowLeftToLine" />
                                </Button>
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <DialogClose />
                        </div>
                        <div className={cn("flex-1 w-full overflow-auto scrollbar--custom px-4 py-10 flex flex-col")}>
                            <HeaderText showOutline={showOutline} />
                            <div className={cn("flex gap-4 w-full mt-10 mb-2 justify-between items-end")}>
                                {!showOutline && (
                                    <AdvancedOptions
                                        allReports={allReports}
                                        selectedTemplateId={selectedTemplateId}
                                        setSelectedTemplateId={setSelectedTemplateId}
                                        contentFiles={contentFiles}
                                        setContentFiles={setContentFiles}
                                    />
                                )}
                                {showOutline && (
                                    <div className="text-muted-foreground font-semibold text-base translate-y-1">
                                        Prompt
                                    </div>
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
                                                    onClick={handleSavePrompt}
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
                                                            await handleGenerateOutline();
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

                            {showOutline ? (
                                <div className="flex flex-col gap-4 mt-2">
                                    {outlineItems && (
                                        <Outline
                                            pages={pages}
                                            outlineItems={outlineItems}
                                            setOutlineItems={setOutlineItems}
                                            isOutlineLoading={isOutlineLoading}
                                        />
                                    )}
                                    {outlineItems && outlineItems.length > 0 && (
                                        <OutlineSettings
                                            contentSize={contentSize}
                                            setContentSize={setContentSize}
                                            targetAudience={targetAudience}
                                            setTargetAudience={setTargetAudience}
                                            tone={tone}
                                            setTone={setTone}
                                        />
                                    )}
                                </div>
                            ) : (
                                <>
                                    <FadeTransition in={prompt.length > 0 && !showOutline} nodeRef={buttonRef}>
                                        <div ref={buttonRef} className="w-full mx-auto mt-2">
                                            {prompt.length > 0 && !showOutline && (
                                                <Button
                                                    className="w-full text-base"
                                                    size="lg"
                                                    onClick={async () => handleGenerateOutline()}
                                                >
                                                    Generate Outline
                                                    <Icon name="Sparkles" className="ml-2 h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </FadeTransition>

                                    <SwitchSlideTransition
                                        switcher={prompt.length === 0}
                                        nodeRef={promptsRef}
                                        direction="Y"
                                        reverse={prompt.length !== 0}
                                        duration={200}
                                    >
                                        <div ref={promptsRef} className="max-w-screen-md mx-auto flex flex-col">
                                            {prompt.length === 0 && (
                                                <>
                                                    <Separator className="my-2" />
                                                    {savedPrompts && savedPrompts.length > 0 && (
                                                        <>
                                                            <SavedPromptsList
                                                                savedPrompts={savedPrompts}
                                                                setSavedPrompts={setSavedPrompts}
                                                                setPrompt={setPrompt}
                                                                setOutlineItems={setOutlineItems}
                                                                onLoadSavedPrompt={handleLoadSavedPrompt}
                                                            />
                                                            <div className="w-full h-[20px]" />
                                                        </>
                                                    )}
                                                    <SamplePrompts setPrompt={setPrompt} />
                                                </>
                                            )}
                                        </div>
                                    </SwitchSlideTransition>
                                </>
                            )}
                        </div>
                        {showOutline && (
                            <div className="w-full px-3 py-2 flex justify-center items-center gap-6 bg-popover border-t z-10">
                                <div className="text-base font-medium">
                                    {outlineItems ? outlineItems.filter(Boolean).length : "0"} pages
                                </div>
                                <Button
                                    disabled={outlineItems ? outlineItems.filter(Boolean).length === 0 : true}
                                    className="text-base px-6"
                                    size="default"
                                    onClick={handleGenerateReport}
                                >
                                    Generate
                                    <Icon name="Sparkles" className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </ModalStyle>
        </Dialog>
    );
};
