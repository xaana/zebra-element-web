import React, { useEffect, useRef, useMemo } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";

import { useBlockEditor } from "@/plugins/reports/hooks/useBlockEditor";
import { Chat, useChat } from "@/plugins/reports/hooks/use-chat";
import { activeStepAtom } from "@/plugins/reports/stores/store";
import { TemplateSelector } from "@/components/reports/TemplateSelector";
import { ReportEditor } from "@/components/reports/ReportEditor";
import { ReportViewer } from "@/components/reports/ReportViewer";
import { reportsStore } from "@/plugins/reports/MainPanel";
import { steps } from "@/plugins/reports/initialContent";
import { useAIState } from "@/plugins/reports/hooks/useAIState";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import { useSidebar } from "@/plugins/reports/hooks/useSidebar";

export const Home = (): JSX.Element => {
    // Use stored state for active step
    const [activeStep, setActiveStep] = useAtom(activeStepAtom);

    // Ref to store element of active step
    const stepRef = useRef<HTMLDivElement | null>(null);

    // Set active step to first step
    useEffect(() => {
        reportsStore.set(activeStepAtom, steps[0]);
    }, []);

    /**
     * Function to advance to the next step in the process.
     */
    const nextStep = (): void => {
        if (activeStep && activeStep.id < steps.length - 1) {
            setActiveStep(steps[activeStep.id + 1]);
        }
    };

    /**
     * Function to go back to the previous step in the process.
     */
    const prevStep = (): void => {
        if (activeStep && activeStep.id > 0) {
            setActiveStep(steps[activeStep.id - 1]);
        }
    };

    const { editor } = useBlockEditor({});

    const leftSidebar = useSidebar();
    const rightSidebar = useSidebar();

    const chat: Chat = useChat({
        isOpen: rightSidebar.isOpen,
        open: rightSidebar.open,
        close: rightSidebar.close,
        toggle: rightSidebar.toggle,
    });

    const aiState = useAIState();

    const providerValue = useMemo(() => {
        return {
            isAiLoading: aiState.isAiLoading,
            aiError: aiState.aiError,
            setIsAiLoading: aiState.setIsAiLoading,
            setAiError: aiState.setAiError,
            editor: editor,
            editorChat: chat,
        };
    }, [aiState, chat, editor]);

    return (
        <EditorContext.Provider value={providerValue}>
            <div className="h-full overflow-auto">
                {activeStep?.id === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={activeStep?.id}
                        ref={stepRef}
                        className="max-w-screen-lg mx-auto px-3 my-8"
                    >
                        <TemplateSelector editor={editor} nextStep={nextStep} prevStep={prevStep} />
                    </motion.div>
                )}
                {activeStep?.id === 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={activeStep?.id}
                        ref={stepRef}
                        className=""
                    >
                        <ReportEditor
                            editor={editor}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            leftSidebar={leftSidebar}
                            rightSidebar={rightSidebar}
                        />
                    </motion.div>
                )}
                {activeStep?.id === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={activeStep?.id}
                        ref={stepRef}
                        className="max-w-screen-lg mx-auto px-3 my-8"
                    >
                        <ReportViewer editor={editor} nextStep={nextStep} prevStep={prevStep} />
                    </motion.div>
                )}
            </div>
        </EditorContext.Provider>
    );
};
