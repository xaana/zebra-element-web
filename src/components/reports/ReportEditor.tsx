import React from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { ContentHeader } from "./ContentHeader";

import { useBlockEditor } from "@/plugins/reports/hooks/useBlockEditor";
import {
    selectedTemplateAtom,
    editorStateAtom,
    editorContentAtom,
    previousTemplateAtom,
} from "@/plugins/reports/stores/store";
import { BlockEditor } from "@/components/reports/BlockEditor";
import { reportsStore } from "@/plugins/reports/MainPanel";
interface ReportEditorProps {
    nextStep: (htmlContent?: string) => void;
    prevStep: () => void;
}
export const ReportEditor = ({ nextStep, prevStep }: ReportEditorProps) => {
    const selectedTemplate = useAtomValue(selectedTemplateAtom);
    const setEditorState = useSetAtom(editorStateAtom);
    const setEditorContent = useSetAtom(editorContentAtom);
    const setPreviousTemplate = useSetAtom(previousTemplateAtom);
    const { editor, characterCount, leftSidebar } = useBlockEditor({
        template: selectedTemplate || undefined,
        editorState: reportsStore.get(editorStateAtom),
    });

    const proceedToGeneratePdf = () => {
        setEditorContent(() => editor?.getHTML());
        setEditorState(() => editor?.getJSON());
        nextStep(editor?.getHTML());
    };

    const backToTemplateSelect = () => {
        setEditorState(() => editor?.getJSON());
        setPreviousTemplate(() => selectedTemplate);
        prevStep();
    };

    return (
        <>
            <ContentHeader nextStepAction={proceedToGeneratePdf} prevStepAction={backToTemplateSelect} />
            <div className="rounded-lg border overflow-hidden">
                <BlockEditor editor={editor} characterCount={characterCount} leftSidebar={leftSidebar} />
            </div>
        </>
    );
};
