import React from "react";
import styled from "styled-components";
import { useAtomValue } from "jotai";

import { StepItem } from "@/plugins/reports/types";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { activeStepAtom } from "@/plugins/reports/stores/store";
import { Progress } from "@/components/ui/progress";
const StepperStyle = styled.div`
    .stepper__list__item:after {
        content: "";
        display: block;
        position: absolute;
        z-index: 2;
    }
    @media (min-width: 48em) {
        .stepper__list__item:after {
            width: calc(100% - 50px);
            top: 20%;
            left: calc(50% + 32px);
            border-top: 2px dotted hsl(var(--border));
        }
    }
    .stepper__list__item {
        transition: all 0.1s;
    }
    @media (min-width: 48em) {
        .stepper__list__item--done:after {
            border-top-style: solid;
            border-top-width: 1px;
        }
    }
    .stepper__list__item--current:last-of-type:after,
    .stepper__list__item--current:only-of-type:after {
        height: 30%;
    }
    .stepper__list__item:last-of-type:after {
        display: none;
    }
    .stepper__list__item--pending:after {
        height: 30%;
    }
`;
export const Stepper = ({ className, steps }: { className?: string; steps: StepItem[] }) => {
    const activeStep = useAtomValue(activeStepAtom);

    return (
        <div className="max-w-[1024px] mx-auto pt-6">
            <StepperStyle className={cn("stepper max-w-[52rem] mx-auto px-3 md:px-0", className)}>
                <ul className="stepper__list w-full flex flex-col sm:flex-row gap-x-4 sm:items-center sm:justify-between list-none gap-y-4">
                    {steps.map((step, index) => (
                        <li
                            className={cn(
                                "stepper__list__item text-center relative flex sm:flex-col sm:flex-1 items-center gap-2",
                                {
                                    "stepper__list__item--done text-muted-foreground":
                                        activeStep && activeStep.id > index,
                                    "stepper__list__item--current text-accent": activeStep?.id === index,
                                    "stepper__list__item--pending text-muted-foreground":
                                        activeStep && activeStep.id < index,
                                },
                            )}
                            key={index}
                        >
                            <div className="stepper__list__icon">
                                {activeStep && activeStep.id > index ? (
                                    <Icon
                                        name="CheckCircle2"
                                        className="text-muted-foreground w-5 h-5"
                                        strokeWidth={3}
                                    />
                                ) : (
                                    <div
                                        className={cn(
                                            "border-[2.5px] font-semibold rounded-full leading-none m-0 w-5 h-5 text-xs flex items-center justify-center",
                                            activeStep?.id === index ? "border-accent" : "border-muted-foreground",
                                        )}
                                    >
                                        {index + 1}
                                    </div>
                                )}
                            </div>
                            <div className="stepper__list__title text-sm font-semibold">{step.text}</div>
                        </li>
                    ))}
                </ul>
            </StepperStyle>
            <Progress value={(((activeStep?.id || 0) + 1) / steps.length) * 100} className="h-[2px] my-8" />
        </div>
    );
};
