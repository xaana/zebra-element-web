import React from "react";
import { useAtom } from "jotai";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { activeStepAtom } from "@/plugins/reports/stores/store";
export const ContentHeader = ({
    nextStepAction,
    prevStepAction,
    nextStepDisabled = false,
    className,
    nextStepNode,
}: {
    nextStepAction: () => void;
    prevStepAction: () => void;
    nextStepDisabled?: boolean;
    className?: string;
    nextStepNode?: React.ReactNode;
}) => {
    const [activeStep] = useAtom(activeStepAtom);
    return (
        <div
            className={cn(
                "w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8",
                className && className,
            )}
        >
            <div>
                <h2 className="text-2xl font-semibold mb-2">{activeStep?.title}</h2>
                <p className="text-muted-foreground text-sm">{activeStep?.description}</p>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={() => prevStepAction()} variant="outline" size="sm">
                    <Icon name="ArrowLeft" className="mr-2" />
                    Go Back
                </Button>
                {/* {activeStep && activeStep.id > 0 && (
                )} */}
                {nextStepNode ? (
                    nextStepNode
                ) : (
                    <Button
                        className="font-semibold"
                        onClick={() => nextStepAction()}
                        size="sm"
                        disabled={nextStepDisabled}
                    >
                        {activeStep?.nextStepTitle}
                        <Icon name="ArrowRight" className="ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};