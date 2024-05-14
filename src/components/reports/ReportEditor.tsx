import React from "react";

import type { Editor } from "@tiptap/react";

import { EditorHeader } from "@/components/reports/BlockEditor/EditorHeader";
import { BlockEditor } from "@/components/reports/BlockEditor";
import { SidebarState } from "@/plugins/reports/hooks/useSidebar";

interface ReportEditorProps {
    editor: Editor | null;
    nextStep: (htmlContent?: string) => void;
    prevStep: () => void;
    leftSidebar: SidebarState;
    rightSidebar: SidebarState;
}
export const ReportEditor = ({
    editor,
    nextStep,
    prevStep,
    leftSidebar,
    rightSidebar,
}: ReportEditorProps): JSX.Element => {
    const proceedToGeneratePdf = (): void => {
        nextStep();
    };

    const backToTemplateSelect = (): void => {
        prevStep();
    };

    return (
        <>
            <div className="w-full p-3 border-b bg-background">
                {editor && (
                    <EditorHeader
                        isLeftSidebarOpen={leftSidebar.isOpen}
                        isRightSidebarOpen={rightSidebar.isOpen}
                        toggleLeftSidebar={leftSidebar.toggle}
                        toggleRightSidebar={rightSidebar.toggle}
                        editor={editor}
                        goBack={backToTemplateSelect}
                        generateReport={proceedToGeneratePdf}
                    />
                )}
            </div>
            <div style={{ height: "calc(100vh - 66px)" }} className="rounded-b-md border overflow-auto">
                <BlockEditor editor={editor} leftSidebar={leftSidebar} rightSidebar={rightSidebar} />
            </div>
        </>
    );
};
