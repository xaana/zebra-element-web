import React, { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import * as Dropdown from "@radix-ui/react-dropdown-menu";

import { Separator } from "@/components/ui/separator";
import { Loader } from "@/components/ui/LoaderAlt";
import { Textarea } from "@/components/ui/TextareaAlt";
import { Button } from "@/components/ui/ButtonAlt";
import { Icon } from "@/components/ui/Icon";
import { Surface } from "@/components/ui/Surface";
import { DropdownButton } from "@/components/ui/Dropdown";

export type DataItem = {
    [key: string]: string | number | null | undefined;
};

export interface DataProps {
    text: string;
    addHeading: boolean;
    database?: string;
    textUnit?: string;
    textLength?: string;
    language?: string;
}

const DataQuerySidebar = ({ onClose }: { onClose: () => void }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [previewText, setPreviewText] = useState<string | undefined>(undefined);
    const textareaId = useMemo(() => uuid(), []);
    const [dbList, setDbList] = useState<string[]>([]);
    const [selectedDb, setSelectedDb] = useState<string | undefined>(undefined);
    const [fetchedData, setFetchedData] = useState<DataItem[]>([]);
    const [data, setData] = useState<DataProps>({
        text: "",
        database: undefined,
        textLength: undefined,
        addHeading: false,
        language: undefined,
    });

    useEffect(() => {
        setDbList(["contracts", "transactions"]);
    }, []);

    const onTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData((prevData) => ({ ...prevData, text: e.target.value }));
    }, []);

    const createItemClickHandler = useCallback((db: string) => {
        return () => {
            setData((prevData) => ({ ...prevData, database: db }));
            setSelectedDb(db);
        };
    }, []);

    const queryDatabase = async () => {
        setIsFetching(true);
        setTimeout(() => {
            console.log(data);
            setPreviewText(`Lorem ipsum dolor sit amet`);
            setFetchedData([{ key: "value" }]);
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
                    <Icon name="DatabaseZap" className="text-primary" />
                    AI Data Query
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
                        <div className="p-4">
                            {fetchedData && (
                                <div>Fetched Data</div>
                                //   <QueryResultTable
                                //     data={fetchedData}
                                //     handleViewCharts={() => {}}
                                //   />
                            )}
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
                    placeholder="What data do you wish to query?"
                    required
                    className="mb-2"
                />
                <div className="flex flex-col gap-2 w-full">
                    <Dropdown.Root>
                        <Dropdown.Trigger asChild>
                            <Button className="w-full text-xs !bg-background" variant="tertiary" buttonSize="small">
                                <Icon name="Database" className="w-3 h-3" />
                                {selectedDb || "Select Database"}
                                <Icon name="ChevronDown" />
                            </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Portal>
                            <Dropdown.Content
                                style={{ zIndex: 99 }}
                                className="w-full"
                                side="bottom"
                                align="start"
                                asChild
                            >
                                <Surface className="p-2 min-w-[20rem] !rounded">
                                    {dbList.map((db, id) => (
                                        <Dropdown.Item asChild key={id}>
                                            <DropdownButton
                                                isActive={db === data.database}
                                                onClick={createItemClickHandler(db)}
                                            >
                                                {db}
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
                            disabled={!data.text || data.text.length < 3 || !selectedDb}
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

export default DataQuerySidebar;
