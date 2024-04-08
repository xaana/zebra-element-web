import React, { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";

import type { StepItem } from "@/plugins/reports/types";
import type { Report } from "@/components/reports/ReportsManager";

import { Stepper } from "@/components/reports/Stepper";
import { SwitchFadeTransition } from "@/components/ui/transitions/switch-fade-transition";
import { activeStepAtom, showHomeAtom } from "@/plugins/reports/stores/store";
import { TemplateSelector } from "@/components/reports/TemplateSelector";
import { ReportEditor } from "@/components/reports/ReportEditor";
import { ReportViewer } from "@/components/reports/ReportViewer";
import { ReportsManager } from "@/components/reports/ReportsManager";
import { reportsStore } from "@/plugins/reports/MainPanel";

export const steps: StepItem[] = [
    {
        id: 0,
        text: "Select a Template",
        title: "Select files and template",
        description: `Zebra will follow the structure of the selected report temlpate to generate a content draft using the selected files as input.`,
        nextStepTitle: "Edit Template",
    },
    {
        id: 1,
        text: "Generate the Report",
        title: "Customize the Report",
        description: `Edit the content of the report template using Zebra AI's tools`,
        nextStepTitle: "Generate Report",
    },
    {
        id: 2,
        text: "Finalise the Report",
        title: `Finalise the Report`,
        description: "View the generated report and export it as a PDF",
        nextStepTitle: "Save Report",
    },
];

export const Home = (): JSX.Element => {
    // Use stored state for active step
    const [activeStep, setActiveStep] = useAtom(activeStepAtom);
    const [showHome, setShowHome] = useAtom(showHomeAtom);

    // const [showManager, setShowManager] = useState(true);

    // State to store animation direction for step transitions
    const [reverseTransition, setReverseTransition] = useState(false);
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
            setReverseTransition(() => false);
        }
    };

    /**
     * Function to go back to the previous step in the process.
     */
    const prevStep = (): void => {
        if (activeStep && activeStep.id > 0) {
            setActiveStep(steps[activeStep.id - 1]);
            setReverseTransition(() => true);
        }
    };

    const onEditReport = (report: Report): void => {
        setShowHome(false);
    };

    return (
        <div className="h-full overflow-auto">
            {showHome ? (
                <ReportsManager onNewReport={() => setShowHome(false)} onEditReport={onEditReport} />
            ) : (
                <>
                    <Stepper steps={steps} />
                    <SwitchFadeTransition
                        switcher={activeStep?.id}
                        nodeRef={stepRef}
                        direction="X"
                        reverse={reverseTransition}
                        duration={400}
                    >
                        <div ref={stepRef} className="max-w-screen-lg mx-auto pb-6 px-3">
                            {activeStep?.id === 0 && <TemplateSelector nextStep={nextStep} prevStep={prevStep} />}
                            {activeStep?.id === 1 && <ReportEditor nextStep={nextStep} prevStep={prevStep} />}
                            {activeStep?.id === 2 && <ReportViewer nextStep={nextStep} prevStep={prevStep} />}
                        </div>
                    </SwitchFadeTransition>
                </>
            )}
        </div>
    );
};