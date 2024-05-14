import React from "react";

import type { icons } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Icon } from "@/components/ui/Icon";
export type Prompt = { text: string; iconName: keyof typeof icons };
export const samplePrompts: Prompt[] = [
    {
        text: "OKRs for [company]",
        iconName: "Crosshair",
    },
    {
        text: "New employee onboaring guide for [company]",
        iconName: "PersonStanding",
    },
    {
        text: "Investment prospectus for an ICO for [company]",
        iconName: "LineChart",
    },
    {
        text: "Statement of work for a contractor working on [task]",
        iconName: "Briefcase",
    },
    {
        text: "Press announcement for [event]",
        iconName: "Newspaper",
    },
    {
        text: "Operation manual for [program]",
        iconName: "MessageCircleWarning",
    },
];

const SamplePrompts = ({ setPrompt }: { setPrompt: React.Dispatch<React.SetStateAction<string>> }): JSX.Element => {
    return (
        <div>
            <Separator className="mt-4 mb-4" />
            <div className="text-lg font-semibold text-center">Example Prompts</div>
            <div className="flex gap-3 flex-wrap mt-4">
                {samplePrompts.map((prompt, index) => (
                    <div
                        key={index}
                        onClick={() => setPrompt(prompt.text)}
                        className="min-h-24 flex justify-between gap-2 cursor-pointer bg-background rounded-sm p-3 basis-1/4 grow transition-all outline-none hover:outline-accent hover:-outline-offset-2"
                    >
                        <div className="flex gap-2">
                            <Icon name={prompt.iconName} className="shrink-0 w-4 h-4 text-primary-default" />
                            <div className="text-sm -mt-0.5">{prompt.text}</div>
                        </div>
                        <Icon name="Plus" className="shrink-0 w-4 h-4 ml-auto text-muted-foreground" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SamplePrompts;
