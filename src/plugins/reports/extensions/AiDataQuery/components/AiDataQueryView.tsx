import React, { useEffect } from "react";
import { NodeViewWrapper, NodeViewWrapperProps } from "@tiptap/react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import * as Dropdown from "@radix-ui/react-dropdown-menu";

import { QueryResultTable, DataItem } from "./QueryResultTable";

import { getVectorConfig } from "@/vector/getconfig";
import { Button } from "@/components/ui/ButtonAlt";
import { Loader } from "@/components/ui/LoaderAlt";
import { Panel, PanelHeadline } from "@/components/ui/Panel";
import { Textarea } from "@/components/ui/Textarea";
import { Icon } from "@/components/ui/Icon";
import { Surface } from "@/components/ui/Surface";
import { DropdownButton } from "@/components/ui/Dropdown";
export interface DataProps {
    text: string;
    addHeading: boolean;
    database?: string;
    textUnit?: string;
    textLength?: string;
    language?: string;
}

export const AiDataQueryView = ({ editor, node, getPos, deleteNode, updateAttributes }: NodeViewWrapperProps) => {
    const [data, setData] = useState<DataProps>({
        text: node.attrs.prompt,
        database: node.attrs.database || undefined,
        textLength: undefined,
        addHeading: false,
        language: undefined,
    });
    const [api, setApi] = useState<string | undefined>(undefined);

    const [previewText, setPreviewText] = useState<string | undefined>(undefined);
    const [isFetching, setIsFetching] = useState(false);
    const textareaId = useMemo(() => uuid(), []);
    const [dbList, setDbList] = useState<string[]>([]);
    const [selectedDb, setSelectedDb] = useState<string | undefined>(undefined);
    const [fetchedData, setFetchedData] = useState<DataItem[]>([]);
    useEffect(() => {
        let apiUrl;

        const getDbList = async (): Promise<void> => {
            const configData = await getVectorConfig();
            if (configData?.bot_api) {
                apiUrl = configData?.bot_api;
                apiUrl && setApi(apiUrl);
                const resp = await fetch(`${apiUrl}/database_list`);
                const data = await resp.json();
                if (data) setDbList(data);
            }
        };

        getDbList();
    }, []);

    const queryDatabase = useCallback(async () => {
        const { text: dataText, database } = data;

        if (!data.text) {
            toast.error("Please enter a description");
            return;
        }

        setIsFetching(true);

        try {
            const res: Response = await fetch(`${api}/database-query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: dataText,
                    database: database,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (data) {
                setPreviewText(data.body);
                data.database_table && setFetchedData(data.database_table);
                setIsFetching(false);
            }
        } catch (errPayload: any) {
            const errorMessage = errPayload?.response?.data?.error;
            const message =
                errorMessage !== "An error occurred" ? `An error has occured: ${errorMessage}` : errorMessage;

            setIsFetching(false);
            toast.error(message);
        }
    }, [data, api]);

    const insert = useCallback(() => {
        const from = getPos();
        const to = from + node.nodeSize;

        console.log(arrayToTableObject(fetchedData));

        // editor.chain().focus().insertContentAt({ from, to }, previewText).run();
        editor.chain().focus().insertContentAt({ from, to }, arrayToTableObject(fetchedData)).run();
    }, [editor, getPos, node.nodeSize, fetchedData]);

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

    const createItemClickHandler = useCallback(
        (db: string) => {
            return () => {
                setData((prevData) => ({ ...prevData, database: db }));
                setSelectedDb(db);
                updateAttributes({
                    database: db,
                });
            };
        },
        [updateAttributes],
    );

    const arrayToTableObject = (arr: DataItem[]) => {
        // Check if the array is empty
        if (arr.length === 0) {
            return {
                type: "table",
                content: [],
            };
        }

        // Extract column names from the first object's keys
        const columnNames = Object.keys(arr[0]);

        // Function to create a table cell object
        const createTableCell = (content: any, isHeader = false) => ({
            type: "tableCell",
            attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                style: null,
            },
            content: [
                {
                    type: "paragraph",
                    attrs: {
                        class: null,
                        textAlign: "left",
                    },
                    content: [
                        {
                            type: isHeader ? "text" : "paragraph",
                            marks: isHeader ? [{ type: "bold" }] : [],
                            text: content,
                        },
                    ],
                },
            ],
        });

        // Create the header row
        const headerRow = {
            type: "tableRow",
            content: columnNames.map((columnName) => createTableCell(columnName, true)),
        };

        // Create the content rows
        const contentRows = arr.map((row) => ({
            type: "tableRow",
            content: columnNames.map((columnName) => createTableCell(row[columnName])),
        }));

        // Combine the header and content rows
        const tableContent = [headerRow, ...contentRows];

        return {
            type: "table",
            content: tableContent,
        };
    };

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
                            <div className="p-4">
                                {fetchedData && <QueryResultTable data={fetchedData} handleViewCharts={() => {}} />}
                            </div>
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
                        placeholder="Tell me what data you wish to query."
                        required
                        className="mb-2"
                    />
                    <div className="flex flex-row items-center justify-between gap-1">
                        <div className="flex justify-between w-auto gap-1">
                            <Dropdown.Root>
                                <Dropdown.Trigger asChild>
                                    <Button variant="tertiary">
                                        <Icon name="Database" />
                                        {selectedDb || "Select Database"}
                                        <Icon name="ChevronDown" />
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Portal>
                                    <Dropdown.Content side="bottom" align="start" asChild>
                                        <Surface className="p-2 min-w-[12rem]">
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
                        </div>
                        <div className="flex justify-between w-auto gap-1">
                            {previewText && (
                                <Button
                                    variant="ghost"
                                    className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                    onClick={discard}
                                >
                                    <Icon name="Trash" />
                                    Discard
                                </Button>
                            )}
                            {previewText && (
                                <Button variant="ghost" onClick={insert} disabled={!previewText}>
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
                                disabled={!data.text || data.text.length < 3 || !selectedDb}
                            >
                                {previewText ? <Icon name="Repeat" /> : <Icon name="DatabaseZap" />}
                                {previewText ? "Regenerate" : "Query"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Panel>
        </NodeViewWrapper>
    );
};
