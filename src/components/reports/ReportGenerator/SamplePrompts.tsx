import React from "react";

import type { icons } from "lucide-react";

import { Icon } from "@/components/ui/Icon";
export type SamplePrompt = { text: string; iconName: keyof typeof icons };
export const samplePrompts: SamplePrompt[] = [
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
            <div className="text-lg font-semibold text-center">Example Prompts</div>
            <div className="grid grid-cols-3 gap-3 mt-2">
                {samplePrompts.map((prompt, index) => (
                    <div
                        key={index}
                        onClick={() => setPrompt(prompt.text)}
                        className="min-h-24 flex justify-between items-start gap-2 cursor-pointer bg-background rounded-sm p-3 transition-all outline-none hover:outline-accent hover:-outline-offset-2"
                    >
                        <div className="flex gap-2 items-start">
                            <Icon name={prompt.iconName} className="shrink-0 w-4 h-4 text-primary-default" />
                            <div className="flex-1 text-sm -mt-0.5">{prompt.text}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SamplePrompts;
