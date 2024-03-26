import { useAtomValue, useSetAtom, useAtom } from "jotai";
import React, { useRef, useState } from "react";
import { RowSelectionState } from "@tanstack/table-core";

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
} from "@/plugins/reports/stores/store";

interface TemplateSelectorProps {
    files: File[];
    templates: Template[];
    nextStep: () => void;
    prevStep: () => void;
}
export const TemplateSelector = ({ files, templates, nextStep, prevStep }: TemplateSelectorProps) => {
    const [selectedTemplate, setSelectedTemplate] = useAtom(selectedTemplateAtom);
    const previousTemplate = useAtomValue(previousTemplateAtom);
    const [selectedFiles, setSelectedFiles] = useAtom(selectedFilesAtom);
    const fileSelector = useRef<FileSelectorHandle>(null);
    const setEditorState = useSetAtom(editorStateAtom);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(
        selectedFiles ? Object.fromEntries(selectedFiles.map((obj) => [obj.id, true])) : {},
    );

    const proceedToEditTemplate = () => {
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
                prevStepAction={prevStep}
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
                <div className="w-full grid grid-cols-4 gap-4">
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
