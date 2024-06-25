import React, { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { RowSelectionState } from "@tanstack/react-table";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { toast } from "sonner";

import type { File } from "@/plugins/files/types";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/LoaderAlt";
import { Textarea } from "@/components/ui/TextareaAlt";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Surface } from "@/components/ui/Surface";
import { DropdownButton } from "@/components/ui/Dropdown";
import { Separator } from "@/components/ui/separator";
import { Toolbar } from "@/components/ui/Toolbar";
import { CollaboraExports } from "@/plugins/reports/hooks/useCollabora";
import { getUserFiles } from "@/lib/utils/getUserFiles";
import { cn } from "@/lib/utils";
import { FilesTable } from "@/components/files/FilesTable";
import { Badge } from "@/components/ui/badge";

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
    const [previewText, setPreviewText] = useState<string | undefined>(undefined);
    const [documents, setDocuments] = useState<File[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [filesDialogOpen, setFilesDialogOpen] = useState(false);
    const textareaId = useMemo(() => uuid(), []);
    const client = useMatrixClientContext();
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const fetchFiles = async (): Promise<void> => {
        const fetchedFiles = await getUserFiles(client);
        // setDocuments([...fetchedFiles.filter((f) => f.type === MsgType.File)]);
        setDocuments([...fetchedFiles]);
    };

    const formatResponse = (rawText: string): string => {
        const ps = rawText.split(/\n/).filter((line) => line.length > 0);
        const newText = ps
            .map((p, i) => {
                if (i !== 0 && i !== ps.length - 1) {
                    return `<p>${p}</p>`;
                }
                return p;
            })
            .join("");
        return newText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    };

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
                setPreviewText((prev) => (prev ? prev + decoder.decode(value) : decoder.decode(value)));

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
                        tone: payload.tone || "",
                        media_ids: extractedFilenames,
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
            toast.error(message);
        }
    }, [data, selectedFiles]);

    const insert = useCallback(() => {
        // Insert plain text
        // previewText && editor.insertText(formatResponse(previewText), false);

        // Insert html formatted content
        previewText && editor.insertCustomHtml(formatResponse(previewText));

        onClose();
    }, [editor, previewText, onClose]);

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

    const handleDialogOpenChange = async (open: boolean): Promise<void> => {
        if (open) {
            await fetchFiles();
        } else {
            setFilesDialogOpen(false);
        }
    };

    const handleRemoveFile = (file: File): void => {
        setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
        setRowSelection({});
    };

    useEffect(() => {
        if (Object.keys(rowSelection).length === 1) {
            setSelectedFiles(Object.keys(rowSelection).map((i) => documents[parseInt(i)]));
            setFilesDialogOpen(false);
        }
    }, [rowSelection, documents]);

    return (
        <div className="h-full w-full px-2 py-4 relative">
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
                {previewText && (
                    <>
                        <div className="text-sm text-muted-foreground mb-1 font-medium">Preview</div>
                        <div
                            className="bg-white dark:bg-black border-l-4 border-neutral-100 dark:border-neutral-700 text-black dark:text-white text-sm max-h-[14rem] mb-4 ml-2.5 overflow-y-auto px-4 relative"
                            dangerouslySetInnerHTML={{ __html: previewText }}
                        />
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
                        <div className="flex items-center gap-2">
                            {selectedFiles.map((file, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-2 h-8">
                                    <div className="text-xs">{file.name}</div>
                                    <Button
                                        onClick={() => handleRemoveFile(file)}
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
                        <Dialog open={filesDialogOpen} onOpenChange={handleDialogOpenChange}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setFilesDialogOpen(true)}>
                                    <Icon name="FileText" className="mr-2" />
                                    Add context file
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] p-0 overflow-hidden">
                                <div className="relative w-[90vw] max-w-[90vw] h-[90vh] p-4">
                                    <h2 className="text-2xl font-semibold tracking-tight my-1">Select Files</h2>
                                    <FilesTable
                                        data={documents}
                                        rowSelection={rowSelection}
                                        setRowSelection={setRowSelection}
                                        mode="dialog"
                                    />

                                    <div
                                        className={cn(
                                            "absolute bottom-0 inset-x-0 flex p-2 border-t items-center bg-background z-[1]",
                                            selectedFiles.length > 0 ? "justify-between" : "justify-end",
                                        )}
                                    >
                                        {selectedFiles.length > 0 && (
                                            <div className="text-sm text-muted-foreground ml-2">
                                                {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"}{" "}
                                                selected
                                            </div>
                                        )}
                                        <Button
                                            size="sm"
                                            disabled={selectedFiles.length === 0}
                                            onClick={() => setFilesDialogOpen(false)}
                                        >
                                            Done
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    <div className="flex justify-between w-auto gap-1">
                        {previewText && (
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
                        {previewText && (
                            <Button
                                variant="ghost"
                                className="w-full"
                                size="sm"
                                onClick={insert}
                                disabled={!previewText}
                            >
                                <Icon name="Check" />
                                Insert
                            </Button>
                        )}
                        <Button
                            variant="default"
                            size="sm"
                            onClick={async () => {
                                previewText && setPreviewText(undefined);
                                await generateText();
                            }}
                            style={{ whiteSpace: "nowrap" }}
                            className="w-full"
                            disabled={!data.text || data.text.length < 3}
                        >
                            {previewText ? (
                                <Icon className="mr-2" name="Repeat" />
                            ) : (
                                <Icon className="mr-2" name="PencilLine" />
                            )}
                            {previewText ? "Regenerate" : "Write"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocQuerySidebar;
