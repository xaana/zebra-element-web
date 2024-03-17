import React, { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";

import type { Template, File, StepItem } from "@/plugins/reports/types";

import { Stepper } from "@/components/reports/Stepper";
import { SwitchFadeTransition } from "@/components/ui/transitions/switch-fade-transition";
import { activeStepAtom } from "@/plugins/reports/stores/store";
import { TemplateSelector } from "@/components/reports/TemplateSelector";
import { ReportEditor } from "@/components/reports/ReportEditor";
import { ReportViewer } from "@/components/reports/ReportViewer";
import { reportsStore } from "@/plugins/reports/MainPanel";

const steps: StepItem[] = [
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
    // State to store files and templates
    const [files, setFiles] = useState<File[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);

    // Use stored state for active step
    const [activeStep, setActiveStep] = useAtom(activeStepAtom);

    // State to store animation direction for step transitions
    const [reverseTransition, setReverseTransition] = useState(false);
    // Ref to store element of active step
    const stepRef = useRef<HTMLDivElement | null>(null);

    // Fetch files and templates from API
    useEffect(() => {
        const fetchFilesData = async (): Promise<void> => {
            try {
                const response = await fetch(`http://localhost:8001/api/files`);
                const data = await response.json();
                setFiles([...data]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchTemplatesData = async (): Promise<void> => {
            try {
                const response = await fetch(`http://localhost:8001/api/templates`);
                const data = await response.json();
                setTemplates([...data]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchFilesData();
        fetchTemplatesData();
        // setTemplates([...templatesData])
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

    return (
        <div className="h-full overflow-auto">
            <Stepper steps={steps} />
            <SwitchFadeTransition
                switcher={activeStep?.id}
                nodeRef={stepRef}
                direction="X"
                reverse={reverseTransition}
                duration={400}
            >
                <div ref={stepRef} className="max-w-[1024px] mx-auto pb-6 px-3 lg:px-0">
                    {activeStep?.id === 0 && (
                        <TemplateSelector templates={templates} files={files} nextStep={nextStep} prevStep={prevStep} />
                    )}
                    {activeStep?.id === 1 && <ReportEditor nextStep={nextStep} prevStep={prevStep} />}
                    {activeStep?.id === 2 && <ReportViewer nextStep={nextStep} prevStep={prevStep} />}
                </div>
            </SwitchFadeTransition>
        </div>
    );
};
