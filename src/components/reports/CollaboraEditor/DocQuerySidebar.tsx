import React, { useCallback, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import * as Dropdown from "@radix-ui/react-dropdown-menu";

import { Loader } from "@/components/ui/LoaderAlt";
import { Textarea } from "@/components/ui/TextareaAlt";
import { Button } from "@/components/ui/ButtonAlt";
import { Icon } from "@/components/ui/Icon";
import { Surface } from "@/components/ui/Surface";
import { DropdownButton } from "@/components/ui/Dropdown";
import { Separator } from "@/components/ui/separator";
import { Toolbar } from "@/components/ui/Toolbar";

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

const DocQuerySidebar = ({ onClose }: { onClose: () => void }) => {
    const [data, setData] = useState<DataProps>({
        text: "",
        tone: undefined,
        textLength: undefined,
        addHeading: false,
        language: undefined,
    });
    const currentTone = tones.find((t) => t.value === data.tone);

    const [isFetching, setIsFetching] = useState(false);
    const [previewText, setPreviewText] = useState<string | undefined>(undefined);
    const textareaId = useMemo(() => uuid(), []);
    // const [documents, setDocuments] = useState<File[]>([])
    // const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    // const [filesDialogOpen, setFilesDialogOpen] = useState(false)

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

    const queryDatabase = async () => {
        setIsFetching(true);
        setTimeout(() => {
            console.log(data);
            setPreviewText(`Lorem ipsum dolor sit amet`);
            setIsFetching(() => false);
        }, 1000);
    };

    const insert = useCallback(() => {
        console.log(`Insert`);
    }, []);

    const discard = useCallback(() => {
        console.log(`Discard`);
    }, []);

    return (
        <div className="h-full w-full px-2 py-4 relative">
            <div className="absolute top-1.5 right-2 flex gap-1.5 items-center z-10">
                <Button buttonSize="small" variant="tertiary" onClick={onClose} className="p-1 h-auto rounded-full">
                    <Icon name="X" className="w-3.5 h-3.5" />
                </Button>
            </div>
            <div className="font-medium text-lg text-primary px-1 flex flex-col">
                <span className="flex items-center gap-1">
                    <Icon name="FileInput" className="text-primary" />
                    AI Doc Query
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
                            <Button className="w-full text-xs !bg-background" variant="tertiary" buttonSize="small">
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
                    <div className="flex justify-between w-auto gap-1">
                        {previewText && (
                            <Button
                                variant="ghost"
                                className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                onClick={discard}
                                buttonSize="small"
                            >
                                <Icon name="Trash" />
                                Discard
                            </Button>
                        )}
                        {previewText && (
                            <Button
                                variant="ghost"
                                className="w-full"
                                buttonSize="small"
                                onClick={insert}
                                disabled={!previewText}
                            >
                                <Icon name="Check" />
                                Insert
                            </Button>
                        )}
                        <Button
                            variant="primary"
                            onClick={async () => {
                                previewText && setPreviewText(undefined);
                                await queryDatabase();
                            }}
                            style={{ whiteSpace: "nowrap" }}
                            className="w-full"
                            buttonSize="small"
                            disabled={!data.text || data.text.length < 3}
                        >
                            {previewText ? <Icon name="Repeat" /> : <Icon name="DatabaseZap" />}
                            {previewText ? "Regenerate" : "Query"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocQuerySidebar;
