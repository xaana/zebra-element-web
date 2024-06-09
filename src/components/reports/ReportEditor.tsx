import React from "react";

import type { Editor } from "@tiptap/react";
import type { Report } from "@/plugins/reports/types";

import { EditorHeader } from "@/components/reports/BlockEditor/EditorHeader";
import { BlockEditor } from "@/components/reports/BlockEditor";
import { SidebarState } from "@/plugins/reports/hooks/useSidebar";
interface ReportEditorProps {
    editor: Editor | null;
    selectedReport: Report | null;
    onGoBack: () => void;
    leftSidebar: SidebarState;
    rightSidebar: SidebarState;
}
export const ReportEditor = ({
    editor,
    selectedReport,
    onGoBack,
    leftSidebar,
    rightSidebar,
}: ReportEditorProps): JSX.Element => {
    const proceedToGeneratePdf = (): void => {
        // nextStep();
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
                        goBack={onGoBack}
                        generateReport={proceedToGeneratePdf}
                    />
                )}
            </div>
            <div style={{ height: "calc(100vh - 60px)" }} className="w-full">
                <BlockEditor editor={editor} leftSidebar={leftSidebar} rightSidebar={rightSidebar} />
            </div>
        </>
    );
};
