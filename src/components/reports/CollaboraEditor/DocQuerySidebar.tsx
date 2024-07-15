import React, { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import type { MatrixFile } from "@/plugins/files/types";
import { MatrixFileSelector } from "../ReportGenerator/MatrixFileSelector";
import { MemoizedReactMarkdown } from "./markdown";

import { Loader } from "@/components/ui/LoaderAlt";
import { Textarea } from "@/components/ui/TextareaAlt";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Surface } from "@/components/ui/Surface";
import { DropdownButton } from "@/components/ui/Dropdown";
import { Separator } from "@/components/ui/separator";
import { Toolbar } from "@/components/ui/Toolbar";
import { CollaboraExports } from "@/plugins/reports/hooks/useCollabora";
import { Badge } from "@/components/ui/badge";
import { markdownToHtml } from "@/lib/utils/markdownToHtml";

export type AiTone =
    | "academic"
    | "business"
    | "casual"
    | "childfriendly"
    | "conversational"
    | "emotional"
    | "humorous"
    | "informative"
    | "inspirational"
    | string;
export type AiToneOption = {
    name: string;
    label: string;
    value: AiTone;
};

const tones: AiToneOption[] = [
    { name: "academic", label: "Academic", value: "academic" },
    { name: "business", label: "Business", value: "business" },
    { name: "casual", label: "Casual", value: "casual" },
    { name: "childfriendly", label: "Childfriendly", value: "childfriendly" },
    { name: "conversational", label: "Conversational", value: "conversational" },
    { name: "emotional", label: "Emotional", value: "emotional" },
    { name: "humorous", label: "Humorous", value: "humorous" },
    { name: "informative", label: "Informative", value: "informative" },
    { name: "inspirational", label: "Inspirational", value: "inspirational" },
    { name: "memeify", label: "Memeify", value: "meme" },
    { name: "narrative", label: "Narrative", value: "narrative" },
    { name: "objective", label: "Objective", value: "objective" },
    { name: "persuasive", label: "Persuasive", value: "persuasive" },
    { name: "poetic", label: "Poetic", value: "poetic" },
];

export interface DataProps {
    text: string;
    addHeading: boolean;
    tone?: AiTone;
    textUnit?: string;
    textLength?: string;
    language?: string;
}

const DocQuerySidebar = ({ onClose, editor }: { onClose: () => void; editor: CollaboraExports }): JSX.Element => {
    const [data, setData] = useState<DataProps>({
        text: "",
        tone: undefined,
        textLength: undefined,
        addHeading: false,
        language: undefined,
    });
    const currentTone = tones.find((t) => t.value === data.tone);
    const [previewTextMd, setPreviewTextMd] = useState<string>();
    const [selectedFiles, setSelectedFiles] = useState<MatrixFile[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const textareaId = useMemo(() => uuid(), []);

    const {
        ref: previewTextScrollAnchorRef,
        entry,
        inView,
    } = useInView({
        trackVisibility: true,
        delay: 100,
        rootMargin: "0px 0px 0px 0px",
    });

    // Effect to auto-scroll down when previewText updates
    useEffect(() => {
        if (isFetching) {
            entry?.target.scrollIntoView({
                block: "start",
            });
        }
    }, [previewTextMd, isFetching, entry, inView]);

    const generateText = useCallback(async () => {
        const { text: dataText, tone, textLength, textUnit, addHeading, language } = data;

        setIsFetching(true);

        const payload = {
            text: dataText,
            textLength: textLength,
            textUnit: textUnit,
            useHeading: addHeading,
            tone,
            language,
        };

        const processStream = (reader: ReadableStreamDefaultReader<any>): Promise<void> | void => {
            // let responseBuffer: string = ''
            const decoder = new TextDecoder();

            // Function to process text from the stream
            const processText = async ({
                done,
                value,
            }: {
                done: boolean;
                value?: AllowSharedBufferSource | undefined;
            }): Promise<void> => {
                if (done) {
                    setIsFetching(false);
                    return;
                }
                // responseBuffer += decoder.decode(value)
                setPreviewTextMd((prev) => (prev ? prev + decoder.decode(value) : decoder.decode(value)));

                // Continue reading the stream
                try {
                    const nextChunk = await reader.read();
                    await processText(nextChunk);
                } catch (error) {
                    console.error("Error while reading the stream:", error);
                }
            };

            if (reader) {
                // Start processing the stream
                reader
                    .read()
                    .then(processText)
                    .catch((error) => {
                        console.error("Error while starting the stream:", error);
                    });
            }
        };

        try {
            const extractedFilenames = selectedFiles.map((file) => file?.downloadUrl?.match(/[^/]+$/)?.[0] ?? null);
            if (
                !extractedFilenames ||
                extractedFilenames.length === 0 ||
                extractedFilenames.every((element) => element === null)
            )
                throw new Error("No attached files found");
            const res: Response = await fetch(
                `${SettingsStore.getValue("reportsApiUrl")}/api/matrix_pdf/generate_pdf`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_requirement: payload.text,
                        media_ids: extractedFilenames,
                        ...(payload.tone && payload.tone.length > 0 ? { tone: payload.tone } : {}),
                    }),
                },
            );

            if (!res.body) {
                throw new Error("No ReadableStream received");
            }

            const reader: ReadableStreamDefaultReader = res.body.getReader();

            processStream(reader);
        } catch (errPayload: any) {
            const errorMessage = errPayload?.response?.data?.error;
            const message =
                errorMessage !== "An error occurred" ? `An error has occured: ${errorMessage}` : errorMessage;

            setIsFetching(false);
            toast.error(message, { closeButton: true });
        }
    }, [data, selectedFiles]);

    const insert = useCallback(() => {
        // Insert html formatted content
        previewTextMd &&
            markdownToHtml(previewTextMd)
                .then((html) => {
                    editor.insertCustomHtml(html);
                })
                .catch((error) => {
                    console.error("Error while inserting report content:", error);
                    toast.error("Report generation failed. Please try again later.");
                });

        onClose();
    }, [editor, previewTextMd, onClose]);

    const discard = useCallback(() => {
        onClose();
    }, [onClose]);

    const onTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData((prevData) => ({ ...prevData, text: e.target.value }));
    }, []);

    const onUndoClick = useCallback(() => {
        setData((prevData) => ({ ...prevData, tone: undefined }));
    }, []);

    const createItemClickHandler = useCallback((tone: AiToneOption) => {
        return () => {
            setData((prevData) => ({ ...prevData, tone: tone.value }));
        };
    }, []);

    return (
        <div className="h-full w-full px-2 py-4 relative overflow-auto">
            <div className="absolute top-1.5 right-2 flex gap-1.5 items-center z-10">
                <Button size="sm" variant="outline" onClick={onClose} className="p-1 h-auto rounded-full">
                    <Icon name="X" className="w-3.5 h-3.5" />
                </Button>
            </div>
            <div className="font-medium text-lg text-primary-default px-1 flex flex-col">
                <span className="flex items-center gap-1">
                    <Icon name="NotebookPen" className="text-primary-default" />
                    AI Writer
                </span>
                <Separator className="mt-1 mb-4" />
            </div>
            <div className="flex flex-col p-1">
                {isFetching && <Loader label="Zebra is now doing its job!" />}
                {previewTextMd && (
                    <>
                        <div className="text-sm text-muted-foreground mb-1 font-medium">Preview</div>
                        <div className="bg-background text-sm max-h-[14rem] mb-4 p-4 overflow-y-auto relative">
                            {/* <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: previewText }} /> */}
                            <MemoizedReactMarkdown
                                className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                                remarkPlugins={[remarkGfm, remarkMath]}
                                components={{
                                    p({ children }: any) {
                                        return <p className="zexa-mb-2 last:zexa-mb-0">{children}</p>;
                                    },
                                    a({ href, children }: any) {
                                        return (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="zexa-text-zinc-500 dark:zexa-text-zinc-400 hover:zexa-underline"
                                            >
                                                {children}
                                                <span className="zexa-text-xs">
                                                    <sup>↗</sup>
                                                </span>
                                            </a>
                                        );
                                    },
                                }}
                            >
                                {previewTextMd}
                            </MemoizedReactMarkdown>
                            <div ref={previewTextScrollAnchorRef} className="h-px w-full" />
                        </div>
                    </>
                )}
                <div className="flex flex-row items-center justify-between gap-1">
                    <div className="text-sm text-muted-foreground mb-1 font-medium">
                        <label htmlFor={textareaId}>Prompt</label>
                    </div>
                </div>
                <Textarea
                    id={textareaId}
                    value={data.text}
                    onChange={onTextAreaChange}
                    placeholder="What you want me to write about?"
                    required
                    className="mb-2"
                />
                <div className="flex flex-col gap-2 w-full">
                    <Dropdown.Root>
                        <Dropdown.Trigger asChild>
                            <Button className="w-full text-xs !bg-background" variant="outline" size="sm">
                                <Icon name="Mic" className="mr-2" />
                                {currentTone?.label || "Change tone"}
                                <Icon name="ChevronDown" className="ml-1" />
                            </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Portal>
                            <Dropdown.Content style={{ zIndex: 99 }} side="bottom" align="start" asChild>
                                <Surface className="p-2 min-w-[20rem]">
                                    {!!data.tone && (
                                        <>
                                            <Dropdown.Item asChild>
                                                <DropdownButton
                                                    isActive={data.tone === undefined}
                                                    onClick={onUndoClick}
                                                >
                                                    <Icon name="Undo2" />
                                                    Reset
                                                </DropdownButton>
                                            </Dropdown.Item>
                                            <Toolbar.Divider horizontal />
                                        </>
                                    )}
                                    {tones.map((tone) => (
                                        <Dropdown.Item asChild key={tone.value}>
                                            <DropdownButton
                                                isActive={tone.value === data.tone}
                                                onClick={createItemClickHandler(tone)}
                                            >
                                                {tone.label}
                                            </DropdownButton>
                                        </Dropdown.Item>
                                    ))}
                                </Surface>
                            </Dropdown.Content>
                        </Dropdown.Portal>
                    </Dropdown.Root>

                    {selectedFiles.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {selectedFiles.map((selectedFile, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1 h-8">
                                    <div className="text-sm w-full overflow-hidden whitespace-nowrap text-ellipsis">
                                        {selectedFile.name}
                                    </div>
                                    <Button
                                        onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                                        variant="ghost"
                                        size="sm"
                                        className="w-auto h-auto p-0.5 rounded-full"
                                    >
                                        <Icon name="X" className="w-3 h-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <MatrixFileSelector
                            setSelectedFiles={setSelectedFiles}
                            triggerContent={
                                <Button className="w-full" variant="outline" size="sm">
                                    <Icon name="FileText" className="mr-2" />
                                    Add context file
                                </Button>
                            }
                        />
                    )}

                    <div className="flex justify-between w-auto gap-1">
                        {previewTextMd && (
                            <Button
                                variant="ghost"
                                className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                onClick={discard}
                                size="sm"
                            >
                                <Icon name="Trash" />
                                Discard
                            </Button>
                        )}
                        {previewTextMd && (
                            <Button
                                variant="ghost"
                                className="w-full"
                                size="sm"
                                onClick={insert}
                                disabled={!previewTextMd}
                            >
                                <Icon name="Check" />
                                Insert
                            </Button>
                        )}
                        <Button
                            variant="default"
                            size="sm"
                            onClick={async () => {
                                previewTextMd && setPreviewTextMd(undefined);
                                await generateText();
                            }}
                            style={{ whiteSpace: "nowrap" }}
                            className="w-full"
                            disabled={!data.text || data.text.length < 3}
                        >
                            {previewTextMd ? (
                                <Icon className="mr-2" name="Repeat" />
                            ) : (
                                <Icon className="mr-2" name="PencilLine" />
                            )}
                            {previewTextMd ? "Regenerate" : "Write"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocQuerySidebar;
