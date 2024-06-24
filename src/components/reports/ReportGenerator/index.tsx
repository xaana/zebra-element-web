import React from "react";
import Textarea from "react-textarea-autosize";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import SamplePrompts from "./SamplePrompts";
import PagesSelector from "./PagesSelector";
import HeaderText from "./HeaderText";
import Outline from "./Outline";
import OutlineSettings from "./OutlineSettings";
import { FileUpload } from "../FileUpload";
import type { File as MatrixFile } from "@/plugins/files/types";

import { IconZebra } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    // TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEnterSubmit } from "@/plugins/reports/hooks/use-enter-submit";
import { SwitchSlideTransition } from "@/components/ui/transitions/switch-slide-transition";
import { FadeTransition } from "@/components/ui/transitions/fade-transition";
import { cn } from "@/lib/utils";
// import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
export const ReportGenerator = ({
    onReportGenerate,
}: {
    onReportGenerate: (
        documentPrompt: string,
        allTitles: string[],
        contentSize: string,
        tone: string,
        targetAudience: string,
        contentMediaId?: string,
    ) => void;
}): JSX.Element => {
    const { onKeyDown } = useEnterSubmit();
    const [prompt, setPrompt] = React.useState("");
    const [pages, setPages] = React.useState(4);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [showOutline, setShowOutline] = React.useState(false);
    const [isOutlineLoading, setIsOutlineLoading] = React.useState(false);
    const [outlineItems, setOutlineItems] = React.useState<string[]>([]);
    const [contentSize, setContentSize] = React.useState<string>("medium");
    const [targetAudience, setTargetAudience] = React.useState<string>("");
    const [contentFile, setContentFile] = React.useState<File>();
    const [contentMediaId, setContentMediaId] = React.useState<string>();
    const [tone, setTone] = React.useState<string>("");
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const promptsRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleGenerateOutline = async (): Promise<void> => {
        setOutlineItems([]);
        setIsOutlineLoading(true);
        setShowOutline(true);
        try {
            const res: Response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/outlines`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    request: prompt,
                    pages_count: pages,
                    ...(contentMediaId && { content_media_id: contentMediaId }),
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
        setIsOutlineLoading(false);
    };

    const handleDialogToggle = (open: boolean): void => {
        if (open) {
            setDrawerOpen(true);
        } else {
            setDrawerOpen(false);
            // Reset state
            setPages(4);
            setOutlineItems([]);
            setShowOutline(false);
            setContentSize("medium");
            setTargetAudience("");
            setTone("");
            setPrompt("");
        }
    };

    const handleGenerateReport = async (): Promise<void> => {
        setDrawerOpen(false);
        onReportGenerate(
            prompt,
            outlineItems.filter(Boolean),
            contentSize,
            tone.length > 0 ? tone : "neutral",
            targetAudience.length > 0 ? targetAudience : "general",
        );
    };

    const handleFileUpload = async (file: File, matrixFile?: MatrixFile): Promise<void> => {
        setContentFile(file);
        let mediaId: string | null = null;
        if (matrixFile) {
            const mediaIdRegexPattern = /\w+:\/\/\w+\.\w+\/(\w+)/;
            const match = mediaIdRegexPattern.exec(matrixFile.mediaId);
            if (match) {
                mediaId = match[1];
            }
        }
        mediaId && setContentMediaId(mediaId);
    };

    return (
        <Dialog open={drawerOpen} onOpenChange={handleDialogToggle}>
            <DialogTrigger asChild>
                <Button className="font-semibold text-sm" size="sm">
                    <div className="mr-2 relative overflow-visible">
                        <IconZebra className="w-5 h-5" />
                        <Icon name="Sparkles" className="absolute -top-1 -right-1 h-2 w-2" />
                    </div>
                    Create New
                </Button>
            </DialogTrigger>
            <DialogContent className="h-screen w-screen max-w-[100vw] bg-card p-0 overflow-hidden">
                <DialogClose className="absolute top-2 right-2" />
                {showOutline && (
                    <div className="absolute top-2 left-2 z-20">
                        <Button
                            className="w-auto h-auto p-2 text-muted-foreground"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setOutlineItems([]);
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
                <div className={cn("overflow-auto relative px-3", showOutline ? "pt-4 pb-16" : "py-10")}>
                    <div className="flex flex-col justify-center w-full max-w-screen-md mx-auto">
                        <HeaderText showOutline={showOutline} />
                        <div
                            className={cn(
                                "flex gap-4 w-full mt-10 mb-2 justify-between",
                                // showOutline ? "justify-between" : "justify-end",
                                // showOutline ? "justify-end" : "justify-between",
                            )}
                        >
                            {!showOutline && (
                                <div className="flex items-center gap-3">
                                    <div className="text-muted-foreground font-semibold text-sm">
                                        Supporting Document:
                                    </div>
                                    {contentFile ? (
                                        <Badge variant="outline" className="flex items-center gap-2 h-8">
                                            <div className="text-xs">{contentFile.name}</div>
                                            <Button
                                                onClick={() => setContentFile(undefined)}
                                                variant="ghost"
                                                size="sm"
                                                className="w-auto h-auto p-0.5 rounded-full"
                                            >
                                                <Icon name="X" className="w-3 h-3" />
                                            </Button>
                                        </Badge>
                                    ) : (
                                        <FileUpload
                                            onFileUpload={handleFileUpload}
                                            buttonText="Select Document"
                                            allowUpload={false}
                                            iconName="FileInput"
                                            buttonVariant="outline"
                                        />
                                    )}
                                </div>
                            )}
                            {showOutline && (
                                <div className="text-muted-foreground font-semibold text-base translate-y-1">
                                    Prompt
                                </div>
                            )}
                            <PagesSelector pages={pages} setPages={setPages} />
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
                                className="w-full resize-none py-2.5 pl-2.5 pr-6 mx-auto focus-within:outline-primary/60 bg-popover text-base border rounded-md max-w-screen-md"
                            />
                            {showOutline && prompt.length > 0 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="default"
                                            className="absolute right-2.5 top-2 p-1.5 h-auto w-auto z-10 rounded-full"
                                            onClick={handleGenerateOutline}
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

                        {showOutline ? (
                            <div className="flex flex-col gap-4 mt-2">
                                <Outline
                                    pages={pages}
                                    outlineItems={outlineItems}
                                    setOutlineItems={setOutlineItems}
                                    isOutlineLoading={isOutlineLoading}
                                />
                                {outlineItems.length > 0 && (
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
                                    <div ref={buttonRef} className="w-[768px] mx-auto mt-2">
                                        {prompt.length > 0 && !showOutline && (
                                            <Button
                                                className="w-full text-base"
                                                size="lg"
                                                onClick={handleGenerateOutline}
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
                                    <div ref={promptsRef} className="max-w-screen-md mx-auto">
                                        {prompt.length === 0 && <SamplePrompts setPrompt={setPrompt} />}
                                    </div>
                                </SwitchSlideTransition>
                            </>
                        )}
                    </div>
                </div>
                {showOutline && (
                    <div className="w-full absolute bottom-0 px-3 py-2 flex justify-center items-center gap-6 bg-popover border-t z-10">
                        <div className="text-base font-medium">{outlineItems.filter(Boolean).length} pages</div>
                        <Button
                            disabled={outlineItems.filter(Boolean).length === 0}
                            className="text-base px-6"
                            size="default"
                            onClick={handleGenerateReport}
                        >
                            Generate
                            <Icon name="Sparkles" className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
