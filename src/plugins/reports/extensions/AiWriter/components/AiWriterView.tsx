import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NodeViewWrapper, NodeViewWrapperProps } from "@tiptap/react";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { RowSelectionState } from "@tanstack/react-table";

import type { MatrixFile as File } from "@/plugins/files/types";

// import { Button } from "@/components/ui/ButtonAlt";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/LoaderAlt";
import { Panel, PanelHeadline } from "@/components/ui/Panel";
import { Textarea } from "@/components/ui/TextareaAlt";
import { Icon } from "@/components/ui/Icon";
import { AiTone, AiToneOption } from "@/components/reports/BlockEditor/types";
import { tones } from "@/lib/constants";
import { Toolbar } from "@/components/ui/Toolbar";
import { Surface } from "@/components/ui/Surface";
import { DropdownButton } from "@/components/ui/Dropdown";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FilesTable } from "@/components/files/FilesTable";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { dtoToFileAdapters, listFiles } from "@/components/files/FileOpsHandler";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";

export interface DataProps {
    text: string;
    addHeading: boolean;
    tone?: AiTone;
    textUnit?: string;
    textLength?: string;
    language?: string;
}

export const AiWriterView = ({
    editor,
    node,
    getPos,
    deleteNode,
    updateAttributes,
}: NodeViewWrapperProps): JSX.Element => {
    const [data, setData] = useState<DataProps>({
        text: node.attrs.prompt,
        tone: node.attrs.tone || undefined,
        textLength: undefined,
        addHeading: false,
        language: undefined,
    });
    const currentTone = tones.find((t) => t.value === data.tone);
    const [previewText, setPreviewText] = useState<string | undefined>(undefined);
    const [documents, setDocuments] = useState<File[] | undefined>();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [filesDialogOpen, setFilesDialogOpen] = useState(false);
    const textareaId = useMemo(() => uuid(), []);
    const client = useMatrixClientContext();
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const fetchFiles = async (): Promise<void> => {
        const fetchedFiles = (await listFiles(client.getUserId() ?? "", undefined, "zebra")).map((item) =>
            dtoToFileAdapters(item, client.getUserId()),
        );
        setDocuments([...fetchedFiles.filter((f) => f.mimetype && !f.mimetype.startsWith("image/"))]);
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
        const from = getPos();
        const to = from + node.nodeSize;

        previewText &&
            unified()
                .use(remarkParse)
                .use(remarkHtml)
                .process(previewText)
                .then((file) => {
                    editor.chain().focus().insertContentAt({ from, to }, String(file)).run();
                })
                .catch(console.error);
    }, [editor, previewText, getPos, node.nodeSize]);

    const discard = useCallback(() => {
        deleteNode();
    }, [deleteNode]);

    const onTextAreaChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setData((prevData) => ({ ...prevData, text: e.target.value }));
            updateAttributes({
                prompt: e.target.value,
            });
        },
        [updateAttributes],
    );

    const onUndoClick = useCallback(() => {
        setData((prevData) => ({ ...prevData, tone: undefined }));
    }, []);

    const createItemClickHandler = useCallback(
        (tone: AiToneOption) => {
            return () => {
                setData((prevData) => ({ ...prevData, tone: tone.value }));
                updateAttributes({
                    tone: tone.value,
                });
            };
        },
        [updateAttributes],
    );

    const handleDialogOpenChange = async (open: boolean): Promise<void> => {
        if (open) {
            await fetchFiles();
            console.log();
        } else {
            setFilesDialogOpen(false);
        }
    };
    const onUpdate = (): void => {
        fetchFiles();
    };

    const handleRemoveFile = (file: File): void => {
        setSelectedFiles(selectedFiles.filter((f) => f.id !== file.id));
        setRowSelection({});
    };

    useEffect(() => {
        if (!documents) return;
        if (Object.keys(rowSelection).length === 1) {
            setSelectedFiles(Object.keys(rowSelection).map((i) => documents[parseInt(i)]));
            setFilesDialogOpen(false);
        }
    }, [rowSelection, documents]);

    return (
        <NodeViewWrapper data-drag-handle>
            <Panel noShadow className="w-full">
                <div className="flex flex-col p-1">
                    {isFetching && <Loader label="Zebra is now doing its job!" />}
                    {previewText && (
                        <>
                            <PanelHeadline>Preview</PanelHeadline>
                            <div
                                className="bg-white dark:bg-black border-l-4 border-neutral-100 dark:border-neutral-700 text-black dark:text-white text-base max-h-[14rem] mb-4 ml-2.5 overflow-y-auto px-4 relative"
                                dangerouslySetInnerHTML={{ __html: previewText }}
                            />
                        </>
                    )}
                    <div className="flex flex-row items-center justify-between gap-1">
                        <PanelHeadline asChild>
                            <label htmlFor={textareaId}>Prompt</label>
                        </PanelHeadline>
                    </div>
                    <Textarea
                        id={textareaId}
                        value={data.text}
                        onChange={onTextAreaChange}
                        placeholder="Tell me what you want me to write about."
                        required
                        className="mb-2"
                    />
                    <div className="flex items-center justify-between gap-1">
                        <div className="flex justify-between w-auto gap-1">
                            <div className="flex items-center gap-3">
                                <Dropdown.Root>
                                    <Dropdown.Trigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Icon name="Mic" className="mr-2" />
                                            {currentTone?.label || "Tone"}
                                            <Icon name="ChevronDown" className="ml-1" />
                                        </Button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Portal>
                                        <Dropdown.Content style={{ zIndex: 99 }} side="bottom" align="start" asChild>
                                            <Surface
                                                className="p-2 min-w-[12rem] overflow-y-scroll"
                                                style={{ maxHeight: 200 }}
                                            >
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
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="flex items-center gap-2 h-8"
                                            >
                                                <div className="text-xs truncate" style={{ maxWidth: 100 }}>
                                                    {file.name}
                                                </div>
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
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFilesDialogOpen(true)}
                                            >
                                                <Icon name="FileText" className="mr-2" />
                                                Add context file
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] p-0 overflow-hidden">
                                            {!documents && (
                                                <div className="relative w-[90vw] max-w-[90vw] h-full p-4">
                                                    <h2 className="text-2xl font-semibold tracking-tight my-1">
                                                        Select Files
                                                    </h2>
                                                    <Loader />
                                                </div>
                                            )}
                                            {documents && (
                                                <div className="relative w-[90vw] max-w-[90vw] h-[90vh] p-4">
                                                    <h2 className="text-2xl font-semibold tracking-tight my-1">
                                                        Select Files
                                                    </h2>
                                                    <FilesTable
                                                        data={documents}
                                                        rowSelection={rowSelection}
                                                        setRowSelection={setRowSelection}
                                                        mode="dialog"
                                                        onUpdate={onUpdate}
                                                    />

                                                    <div
                                                        className={cn(
                                                            "absolute bottom-0 inset-x-0 flex p-2 border-t items-center bg-background z-[1]",
                                                            selectedFiles.length > 0
                                                                ? "justify-between"
                                                                : "justify-end",
                                                        )}
                                                    >
                                                        {selectedFiles.length > 0 && (
                                                            <div className="text-sm text-muted-foreground ml-2">
                                                                {selectedFiles.length}{" "}
                                                                {selectedFiles.length === 1 ? "file" : "files"} selected
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
                                            )}
                                            {documents && (
                                                <div className="relative w-[90vw] max-w-[90vw] h-[90vh] p-4">
                                                    <h2 className="text-2xl font-semibold tracking-tight my-1">
                                                        Select Files
                                                    </h2>
                                                    <FilesTable
                                                        data={documents}
                                                        rowSelection={rowSelection}
                                                        setRowSelection={setRowSelection}
                                                        mode="dialog"
                                                        onUpdate={onUpdate}
                                                    />

                                                    <div
                                                        className={cn(
                                                            "absolute bottom-0 inset-x-0 flex p-2 border-t items-center bg-background z-[1]",
                                                            selectedFiles.length > 0
                                                                ? "justify-between"
                                                                : "justify-end",
                                                        )}
                                                    >
                                                        {selectedFiles.length > 0 && (
                                                            <div className="text-sm text-muted-foreground ml-2">
                                                                {selectedFiles.length}{" "}
                                                                {selectedFiles.length === 1 ? "file" : "files"} selected
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
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between w-auto gap-1">
                            {previewText && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                    onClick={discard}
                                >
                                    <Icon name="Trash" />
                                </Button>
                            )}
                            {previewText && (
                                <Button variant="outline" size="sm" onClick={insert} disabled={!previewText}>
                                    <Icon name="Check" />
                                </Button>
                            )}
                            <Button
                                variant="default"
                                size="sm"
                                onClick={async () => {
                                    previewText && setPreviewText(undefined);
                                    await generateText();
                                }}
                                disabled={isFetching || selectedFiles.length === 0 || data.text.length < 3}
                            >
                                {previewText ? (
                                    <Icon className="mr-2" name="Repeat" />
                                ) : (
                                    <Icon className="mr-2" name="Sparkles" />
                                )}
                                {previewText ? "Regenerate" : "Generate text"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Panel>
        </NodeViewWrapper>
    );
};
