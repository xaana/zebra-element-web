import React, { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { toast } from "sonner";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { useInView } from "react-intersection-observer";

import { Separator } from "@/components/ui/separator";
import { Loader } from "@/components/ui/LoaderAlt";
import { Textarea } from "@/components/ui/TextareaAlt";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Surface } from "@/components/ui/Surface";
import { DropdownButton } from "@/components/ui/Dropdown";
import { CollaboraExports } from "@/plugins/reports/hooks/useCollabora";
import { QueryResultTable } from "@/plugins/reports/extensions/AiDataQuery/components/QueryResultTable";

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

const DataQuerySidebar = ({ onClose, editor }: { onClose: () => void; editor: CollaboraExports }): JSX.Element => {
    const [isFetching, setIsFetching] = useState(false);
    const [previewText, setPreviewText] = useState<string | undefined>(undefined);
    const textareaId = useMemo(() => uuid(), []);
    const [dbList, setDbList] = useState<string[]>([]);
    const [selectedDb, setSelectedDb] = useState<string | undefined>(undefined);
    const [fetchedData, setFetchedData] = useState<DataItem[]>([]);
    const client = useMatrixClientContext();
    const userId = client.getSafeUserId();
    const [data, setData] = useState<DataProps>({
        text: "",
        database: undefined,
        textLength: undefined,
        addHeading: false,
        language: undefined,
    });

    useEffect(() => {
        const getDbList = async (): Promise<void> => {
            const apiUrl = SettingsStore.getValue("botApiUrl");
            if (apiUrl) {
                const resp = await fetch(`${apiUrl}/database_list`);
                const data = await resp.json();
                if (data) setDbList(data);
            }
        };

        getDbList();
    }, []);

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
    }, [previewText, isFetching, entry, inView]);

    const onTextAreaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData((prevData) => ({ ...prevData, text: e.target.value }));
    }, []);

    const createItemClickHandler = useCallback((db: string) => {
        return (): void => {
            setData((prevData) => ({ ...prevData, database: db }));
            setSelectedDb(db);
        };
    }, []);

    const queryDatabase = useCallback(async () => {
        const { text: dataText, database } = data;

        if (!data.text) {
            toast.error("Please enter a description");
            return;
        }

        setIsFetching(true);

        try {
            const res: Response = await fetch(`${SettingsStore.getValue("botApiUrl")}/database-query`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: dataText,
                    database: database,
                    user_id: userId,
                }),
            });

            const data = await res.json();
            // console.log(data);

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
    }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

    const insert = useCallback(() => {
        previewText && editor.insertText(previewText, false);

        const tableContent = arrayToHTMLTable(fetchedData);

        editor.insertCustomHtml(tableContent);
        onClose();
    }, [editor, fetchedData, previewText, onClose]);

    const discard = useCallback(() => {
        onClose();
    }, [onClose]);

    function arrayToHTMLTable(arr: DataItem[]): string {
        // Check if the array is empty
        if (arr.length === 0) {
            return "<p>No data to display.</p>";
        }

        // Extract column names from the first object's keys
        const columnNames = Object.keys(arr[0]);

        // Start the table and add a header row
        let tableHTML = `<table><tr style="font-weight: 600;">${columnNames
            .map((columnName) => `<td>${columnName}</td>`)
            .join("")}</tr>`;

        // Add the data rows
        arr.forEach((row) => {
            tableHTML += `<tr>${columnNames.map((columnName) => `<td>${row[columnName]}</td>`).join("")}</tr>`;
        });

        // Close the table
        tableHTML += "</table>";

        return tableHTML;
    }

    return (
        <div className="h-full w-full px-2 py-4 relative overflow-auto">
            <div className="absolute top-1.5 right-2 flex gap-1.5 items-center z-10">
                <Button size="sm" variant="outline" onClick={onClose} className="p-1 h-auto rounded-full">
                    <Icon name="X" className="w-3.5 h-3.5" />
                </Button>
            </div>
            <div className="font-medium text-lg text-primary-default px-1 flex flex-col">
                <span className="flex items-center gap-1">
                    <Icon name="DatabaseZap" className="text-primary-default" />
                    AI Data Query
                </span>
                <Separator className="mt-1 mb-4" />
            </div>
            <div className="flex flex-col p-1">
                {isFetching && <Loader label="Zebra is now doing its job!" />}
                {previewText && (
                    <>
                        <div className="text-sm text-muted-foreground mb-1 font-medium">Preview</div>

                        <div className="bg-background text-sm max-h-[14rem] mb-4 p-4 overflow-y-auto relative">
                            <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: previewText }} />
                            <div ref={previewTextScrollAnchorRef} className="h-px w-full" />
                        </div>
                        <div className="bg-background rounded-md border">
                            {fetchedData && <QueryResultTable data={fetchedData} handleViewCharts={() => {}} />}
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
                            <Button className="w-full text-xs !bg-background" variant="outline" size="sm">
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
                                <Surface className="p-2 min-w-[20rem] !rounded max-h-[200px] overflow-y-auto scrollbar--custom">
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
                            onClick={async () => {
                                previewText && setPreviewText(undefined);
                                await queryDatabase();
                            }}
                            style={{ whiteSpace: "nowrap" }}
                            className="w-full"
                            size="sm"
                            disabled={!data.text || data.text.length < 3 || !selectedDb}
                        >
                            {previewText ? (
                                <Icon className="mr-2" name="Repeat" />
                            ) : (
                                <Icon className="mr-2" name="DatabaseZap" />
                            )}
                            {previewText ? "Regenerate" : "Query"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataQuerySidebar;
