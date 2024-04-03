import { useAtomValue, useSetAtom, useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { RowSelectionState } from "@tanstack/table-core";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { ContentHeader } from "./ContentHeader";
import { FileSelector, FileSelectorHandle } from "./FileSelector";
import { TemplateCard } from "./TemplateCard";
import type { Template } from "@/plugins/reports/types";
import type { File } from "@/plugins/files/types";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import {
    selectedTemplateAtom,
    previousTemplateAtom,
    editorStateAtom,
    selectedFilesAtom,
    apiUrlAtom,
    showHomeAtom,
} from "@/plugins/reports/stores/store";
import { reportsStore } from "@/plugins/reports/MainPanel";
import { useFiles } from "@/lib/hooks/use-files";

interface TemplateSelectorProps {
    nextStep: () => void;
    prevStep: () => void;
}
export const TemplateSelector = ({ nextStep, prevStep }: TemplateSelectorProps) => {
    const client = useMatrixClientContext();
    const userId: string = client.getSafeUserId();
    const [selectedTemplate, setSelectedTemplate] = useAtom(selectedTemplateAtom);
    const setShowHome = useSetAtom(showHomeAtom);
    const previousTemplate = useAtomValue(previousTemplateAtom);
    const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom);
    const fileSelector = useRef<FileSelectorHandle>(null);
    const setEditorState = useSetAtom(editorStateAtom);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(
        selectedFiles ? Object.fromEntries(selectedFiles.map((obj) => [obj.id, true])) : {},
    );

    const [templates, setTemplates] = useState<Template[]>([]);
    const { getUserFiles } = useFiles();
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        const fetchTemplatesData = async (): Promise<void> => {
            try {
                const response = await fetch(`${reportsStore.get(apiUrlAtom)}/api/template/get_template_list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ user_id: userId }),
                });
                const data = await response.json();
                if (data?.templates?.length === 0) return;
                setTemplates(() =>
                    data.templates.map(
                        ({
                            id: id,
                            template_name: name,
                            template_description: description,
                            updated_at: createdAt,
                        }: {
                            id: string;
                            template_name: string;
                            template_description: string;
                            updated_at: Date;
                        }) => ({ id, name, description: description ?? "", createdAt }),
                    ),
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchData = async (): Promise<void> => {
            const fetchedFiles = await getUserFiles();
            setFiles(() => fetchedFiles.filter((file) => file.name.endsWith(".pdf")));
            await fetchTemplatesData();
        };

        fetchData();
    }, [getUserFiles, userId]);

    const fetchTemplateContent = async (): Promise<void> => {
        const templateId: string = selectedTemplate?.id ?? "";
        try {
            const response = await fetch(`${reportsStore.get(apiUrlAtom)}/api/template/get_template`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ template_id: templateId }),
            });
            const data = await response.json();
            setSelectedTemplate((prev) => {
                return prev ? { ...prev, content: data.content } : undefined;
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const proceedToEditTemplate = async () => {
        selectedTemplate && (await fetchTemplateContent());
        // check of rowSelection has more than one item
        if (Object.keys(rowSelection).length > 0) {
            setSelectedFiles(() => files.filter((file: File) => rowSelection[file.id]));
            if (selectedTemplate?.id !== previousTemplate?.id) {
                setEditorState(() => undefined);
            }
            nextStep();
        }
    };
    return (
        <>
            <ContentHeader
                nextStepDisabled={selectedTemplate === null || Object.keys(rowSelection).length === 0}
                nextStepAction={proceedToEditTemplate}
                prevStepAction={() => setShowHome(true)}
            />

            <div className="text-lg font-semibold">Select Files</div>

            <FileSelector
                ref={fileSelector}
                files={files}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
            />

            <div className="text-lg font-semibold mt-4 mb-2">Select Template</div>

            <div className="rounded-lg border bg-card p-4 w-full">
                <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div
                        key="new-template"
                        className={cn(
                            "rounded-lg border pb-3 text-left text-sm transition-all hover:bg-muted overflow-hidden cursor-pointer outline-none",
                            !selectedTemplate && "outline outline-4 outline-primary bg-muted",
                        )}
                        onClick={() => setSelectedTemplate(() => undefined)}
                    >
                        <div className="p-3 w-full h-full flex flex-col items-center justify-center gap-2">
                            <Icon name="Plus" className="w-8 h-8" />
                            <div className="font-semibold text-xl">New Template</div>
                        </div>
                    </div>
                    {templates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            selected={selectedTemplate && selectedTemplate.id === template.id}
                            setSelectedTemplate={setSelectedTemplate}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};
