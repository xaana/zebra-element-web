import React from "react";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { toast, Toaster } from "sonner";

import SamplePrompts from "./SamplePrompts";
import HeaderText from "./HeaderText";
import Outline from "./Outline";
import OutlineSettings from "./OutlineSettings";
import type { MatrixFile } from "@/plugins/files/types";
import { AdvancedOptions } from "./AdvancedOptions";
import { SavedPrompt, SavedPromptsList } from "./SavedPromptsList";
import { PromptInput } from "./PromptInput";

import { IconZebra } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SwitchSlideTransition } from "@/components/ui/transitions/switch-slide-transition";
import { FadeTransition } from "@/components/ui/transitions/fade-transition";
import { cn } from "@/lib/utils";
import { AiGenerationContent, Report } from "@/plugins/reports/types";
import { Separator } from "@/components/ui/separator";
import { mediaIdsFromFiles } from "@/plugins/files/utils";
import PagesSelector from "@/components/reports/ReportGenerator/PagesSelector";

export const ReportGenerator = ({
    onReportGenerate,
    allReports,
    userId,
}: {
    onReportGenerate: (aiGenerate: AiGenerationContent) => Promise<void>;
    allReports: Report[];
    userId: string;
}): JSX.Element => {
    const [prompt, setPrompt] = React.useState("");
    const [responseLength, setResponseLength] = React.useState("short");
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [showOutline, setShowOutline] = React.useState(false);
    const [isOutlineLoading, setIsOutlineLoading] = React.useState(false);
    const [useAdvancedOptions, setUseAdvancedOptions] = React.useState(false);
    const [outlineItems, setOutlineItems] = React.useState<string[]>();
    const [savedPrompts, setSavedPrompts] = React.useState<SavedPrompt[]>([]);
    const [promptSaveStatus, setPromptSaveStatus] = React.useState<string>();
    const [contentSize, setContentSize] = React.useState<string>("medium");
    const [targetAudience, setTargetAudience] = React.useState<string>("");
    const [requirementDocuments, setRequirementDocuments] = React.useState<MatrixFile[]>([]);
    const [supportingDocuments, setSupportingDocuments] = React.useState<MatrixFile[]>([]);
    const [tone, setTone] = React.useState<string>("");

    const promptsRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLDivElement>(null);

    const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>();

    const handleGenerateOutline = async (customOutlineItems?: string[]): Promise<void> => {
        const mediaIds = mediaIdsFromFiles(supportingDocuments);

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
                        pages_count: responseLength === "long" ? 8 : 4,
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

    const resetState = (): void => {
        setResponseLength("short");
        setOutlineItems(undefined);
        setShowOutline(false);
        setContentSize("medium");
        setTargetAudience("");
        setTone("");
        setPrompt("");
        setSelectedTemplateId(undefined);
        setSupportingDocuments([]);
        setRequirementDocuments([]);
        setPromptSaveStatus(undefined);
    };

    const handleDialogToggle = async (open: boolean): Promise<void> => {
        if (open) {
            setDrawerOpen(true);
            await fetchSavedPrompts();
        } else {
            setDrawerOpen(false);
            // Reset state
            resetState();
        }
    };

    const handleGenerateReport = async (): Promise<void> => {
        setDrawerOpen(false);

        // Send Request

        // try {
        //     const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/outlines`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             request: prompt,
        //             section_number: sectionNumber,
        //             ...(mediaIds.length > 0 && { content_media_ids: mediaIds }),
        //         }),
        //     });
        //     const data = await res.json();
        //     setOutlineItems(data);
        // } catch (errPayload: any) {
        //     const errorMessage = errPayload?.response?.data?.error;
        //     const message =
        //         errorMessage !== "An error occurred" ? `An error has occured: ${errorMessage}` : errorMessage;
        //     console.error(message);
        //     setShowOutline(false);
        // }

        // Callback
        await onReportGenerate({
            documentPrompt: prompt,
            allTitles: outlineItems ? outlineItems.filter(Boolean) : [],
            contentSize,
            responseLength,
            tone: tone.length > 0 ? tone : "neutral",
            targetAudience: targetAudience.length > 0 ? targetAudience : "general",
            requirementDocuments: requirementDocuments.length > 0 ? requirementDocuments : undefined,
            supportingDocuments: supportingDocuments.length > 0 ? supportingDocuments : undefined,
            templateId: selectedTemplateId ?? undefined,
        } as AiGenerationContent);
    };

    React.useEffect(() => {
        if (!useAdvancedOptions) {
            setSupportingDocuments([]);
            setRequirementDocuments([]);
            setSelectedTemplateId(undefined);
        }
    }, [useAdvancedOptions]);

    return (
        <Dialog open={drawerOpen} onOpenChange={handleDialogToggle}>
            <DialogTrigger asChild>
                <Button className="font-semibold text-sm" size="sm">
                    <div className="mr-2 relative">
                        <IconZebra className="w-5 h-5" />
                        <Icon name="Sparkles" className="absolute -top-1 -right-1 h-2 w-2 border-none" />
                    </div>
                    Create New
                </Button>
            </DialogTrigger>
            <DialogContent
                className="h-[90vh] w-[800px] max-w-[800px]"
                style={{
                    padding: "2px",
                    borderStyle: "none",
                    background:
                        "linear-gradient(90deg, var(--cpd-color-zebra-800) 0%, #d58fed 50%, var(--cpd-color-zebra-800) 100%)",
                    // overflow: "hidden",
                }}
            >
                <div
                    className="w-full h-full relative bg-card overflow-auto scrollbar--custom flex flex-col"
                    style={{
                        borderRadius: "6px",
                        // background: "linear-gradient(transparent -50%, white 20%, white 80%, transparent 150%)",
                    }}
                >
                    <Toaster />
                    {showOutline && (
                        <div className="absolute top-4 left-4 z-20">
                            <Button
                                className="w-auto h-auto p-2 text-muted-foreground"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setOutlineItems(undefined);
                                    setShowOutline(false);
                                }}
                            >
                                <Icon name="ArrowBigLeft" />
                            </Button>
                        </div>
                    )}
                    <DialogClose />
                    <div className={cn("flex-1 w-full overflow-auto scrollbar--custom px-4 py-10 flex flex-col")}>
                        <HeaderText showOutline={showOutline} />

                        {requirementDocuments.length === 0 && (
                            <PromptInput
                                prompt={prompt}
                                setPrompt={setPrompt}
                                showOutline={showOutline}
                                promptSaveStatus={promptSaveStatus}
                                onSavePrompt={handleSavePrompt}
                                onGenerateOutline={handleGenerateOutline}
                                onAddDocument={() => {
                                    setUseAdvancedOptions(true);
                                }}
                            />
                        )}

                        {showOutline ? (
                            <>
                                <div className="flex flex-col gap-4 mt-2">
                                    <Outline
                                        pages={responseLength}
                                        outlineItems={outlineItems ?? []}
                                        setOutlineItems={setOutlineItems}
                                        isOutlineLoading={isOutlineLoading}
                                    />
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
                            </>
                        ) : (
                            <>
                                <PagesSelector responseLength={responseLength} setResponseLength={setResponseLength} />
                                <AdvancedOptions
                                    useAdvancedOptions={useAdvancedOptions}
                                    setUseAdvancedOptions={setUseAdvancedOptions}
                                    allReports={allReports}
                                    selectedTemplateId={selectedTemplateId}
                                    setSelectedTemplateId={setSelectedTemplateId}
                                    supportingDocuments={supportingDocuments}
                                    setSupportingDocuments={setSupportingDocuments}
                                    requirementDocuments={requirementDocuments}
                                    setRequirementDocuments={setRequirementDocuments}
                                />
                                <FadeTransition
                                    in={(prompt.length > 0 || requirementDocuments.length > 0) && !showOutline}
                                    nodeRef={buttonRef}
                                >
                                    <div ref={buttonRef} className="w-full mx-auto mt-2">
                                        {(prompt.length > 0 || requirementDocuments.length > 0) && !showOutline && (
                                            <Button
                                                className="w-full text-base"
                                                size="lg"
                                                onClick={async () => {
                                                    if (requirementDocuments.length === 0) {
                                                        await handleGenerateOutline();
                                                    } else {
                                                        await handleGenerateReport();
                                                    }
                                                }}
                                            >
                                                {requirementDocuments.length > 0 ? "Generate Report" : "Next"}
                                                {requirementDocuments.length > 0 ? (
                                                    <Icon name="Sparkles" className="ml-2 h-4 w-4" />
                                                ) : (
                                                    <Icon name="ArrowBigRightDash" className="ml-2 h-4 w-4" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </FadeTransition>

                                <SwitchSlideTransition
                                    switcher={prompt.length === 0 && !useAdvancedOptions}
                                    nodeRef={promptsRef}
                                    direction="Y"
                                    reverse={prompt.length !== 0 || useAdvancedOptions}
                                    duration={200}
                                >
                                    <div ref={promptsRef} className="max-w-screen-md mx-auto flex flex-col">
                                        {prompt.length === 0 && !useAdvancedOptions && (
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
        </Dialog>
    );
};
