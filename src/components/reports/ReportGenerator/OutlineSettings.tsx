import React, { useRef } from "react";
import Textarea from "react-textarea-autosize";

import { Icon } from "@/components/ui/Icon";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { SwitchSlideTransition } from "@/components/ui/transitions/switch-slide-transition";
const audiences = ["Government", "Business", "College students", "Creatives", "Tech enthusiasts"];
const tones = ["Professional", "Conversational", "Technical", "Academic", "Inspirational", "Humorous"];

const OutlineSettings = ({
    contentSize,
    setContentSize,
    targetAudience,
    setTargetAudience,
    tone,
    setTone,
}: {
    contentSize: string;
    setContentSize: React.Dispatch<React.SetStateAction<string>>;
    targetAudience: string;
    setTargetAudience: React.Dispatch<React.SetStateAction<string>>;
    tone: string;
    setTone: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
    const audienceRef = useRef(null);
    const audienceButtonsRef = useRef(null);
    const toneButtonsRef = useRef(null);
    return (
        <div className="w-full">
            <div className="text-base text-muted-foreground font-semibold">Settings</div>
            <div className="bg-popover p-3 rounded-md mt-1 flex flex-col gap-5">
                <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Amount of text per page</div>
                    <ToggleGroup
                        size="sm"
                        type="single"
                        value={contentSize}
                        onValueChange={(value) => setContentSize(value)}
                        className="justify-start gap-0 w-full border rounded-sm overflow-hidden"
                    >
                        <ToggleGroupItem value="brief" aria-label="Toggle brief" className="flex-1 rounded-none">
                            <Icon name="SignalLow" className="mr-1" />
                            Brief
                        </ToggleGroupItem>
                        <ToggleGroupItem value="medium" aria-label="Toggle medium" className="flex-1 rounded-none">
                            <Icon name="SignalHigh" className="mr-1" />
                            Medium
                        </ToggleGroupItem>
                        <ToggleGroupItem value="detailed" aria-label="Toggle detailed" className="flex-1 rounded-none">
                            <Icon name="Signal" className="mr-1" />
                            Detailed
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Write for...</div>
                    <Textarea
                        ref={audienceRef}
                        tabIndex={0}
                        // onKeyDown={onKeyDown}
                        style={{ boxSizing: "border-box" }}
                        minRows={1}
                        maxRows={3}
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        spellCheck={false}
                        className="w-full resize-none p-1.5 mx-auto focus-within:outline-primary/60 bg-popover text-sm border rounded-md"
                    />
                    <SwitchSlideTransition
                        switcher={targetAudience.length === 0}
                        nodeRef={audienceButtonsRef}
                        direction="Y"
                        reverse={targetAudience.length !== 0}
                        duration={200}
                    >
                        <div ref={audienceButtonsRef}>
                            {targetAudience.length === 0 && (
                                <div className="transition-all flex flex-row flex-wrap gap-2 items-center mt-1">
                                    {audiences.map((audience, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => setTargetAudience(audience)}
                                            variant="secondary"
                                            size="sm"
                                            className="h-auto w-auto px-2 py-1 font-normal"
                                        >
                                            {audience}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SwitchSlideTransition>
                </div>
                <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Tone</div>
                    <Textarea
                        ref={audienceRef}
                        tabIndex={0}
                        // onKeyDown={onKeyDown}
                        style={{ boxSizing: "border-box" }}
                        minRows={1}
                        maxRows={3}
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        spellCheck={false}
                        className="w-full resize-none p-1.5 mx-auto focus-within:outline-primary/60 bg-popover text-sm border rounded-md"
                    />
                    <SwitchSlideTransition
                        switcher={tone.length === 0}
                        nodeRef={toneButtonsRef}
                        direction="Y"
                        reverse={tone.length !== 0}
                        duration={200}
                    >
                        <div ref={toneButtonsRef}>
                            {tone.length === 0 && (
                                <div className="transition-all flex flex-row flex-wrap gap-2 items-center mt-1">
                                    {tones.map((t, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => setTone(t)}
                                            variant="secondary"
                                            size="sm"
                                            className="h-auto w-auto px-2 py-1 font-normal"
                                        >
                                            {t}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SwitchSlideTransition>
                </div>
            </div>
        </div>
    );
};

export default OutlineSettings;
