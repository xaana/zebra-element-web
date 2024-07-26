import React from "react";
import Textarea from "react-textarea-autosize";

import { Button } from "@/components/ui/button";
import { useEnterSubmit } from "@/plugins/reports/hooks/use-enter-submit";
import DotPulseLoader from "@/components/ui/loaders/dot-pulse-loader";
import { Icon } from "@/components/ui/Icon";
import Tooltip from "@/components/ui/TooltipAlt";
import { IconZebra } from "@/components/ui/icons";
// Interface when disabled is provided and disabledMessage is required
interface ChatQueryFormPropsWithDisabled {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    onQueryFormSubmit: () => void;
    isLoading: boolean;
    disabled: boolean;
    disabledMessage: string;
    onStop?: () => void;
    sheet?:boolean;
    setSheetQuery: (query: string) => void;
}

// Interface when disabled and disabledMessage are optional
interface ChatQueryFormPropsWithoutDisabled {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    onQueryFormSubmit: (query?: string) => void;
    isLoading: boolean;
    disabled?: never;
    disabledMessage?: string;
    onStop?: () => void;
    sheet?:boolean;
    setSheetQuery: (query: string) => void;
}

// Combining both interfaces using a union type
type ChatQueryFormProps = ChatQueryFormPropsWithDisabled | ChatQueryFormPropsWithoutDisabled;

export function ChatQueryForm({
    onQueryFormSubmit,
    input,
    isLoading,
    setInput,
    disabled = false,
    disabledMessage = "",
    onStop,
    sheet,
    setSheetQuery,
}: ChatQueryFormProps): JSX.Element {
    const { formRef, onKeyDown } = useEnterSubmit();
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const [insights, setInsights] = React.useState("Filling");
    const handleTaggle = (e) => {
        e.preventDefault();
        if(insights==="Insights"){
            setSheetQuery("Filling")
            setInsights("Filling")
        }else{
            setSheetQuery("Insights")
            setInsights("Insights")
        }
    }
    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (!input?.trim()) {
                    return;
                }
                onQueryFormSubmit();
            }}
            ref={formRef}
        >
            <div className="absolute bottom-0 inset-x-0 z-50 p-2">
                <div className="flex max-h-60 w-full grow items-center gap-x-2 overflow-hidden bg-background px-2 rounded-xl">
                    <Textarea
                        ref={inputRef}
                        tabIndex={0}
                        onKeyDown={onKeyDown}
                        disabled={disabled}
                        style={{ boxSizing: "border-box" }}
                        minRows={1}
                        maxRows={3}
                        value={input?input:" "}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={disabled && disabledMessage ? disabledMessage : "Message Zebra..."}
                        spellCheck={false}
                        className="w-full resize-none bg-transparent py-3.5 focus-within:outline-none text-sm"
                    />
                    {sheet&&<Button variant="outline" size="icon" className="font-semibold text-xs h-7 w-16" onClick={(e)=>handleTaggle(e)}>
                        <IconZebra className="h-4 w-4" />
                            {insights}
                    </Button>}
                    {isLoading ? (
                        <DotPulseLoader />
                    ) : (
                        <Tooltip title="Send" content="Send message">
                            <Button type="submit" size="sm" className="!px-2" disabled={disabled || !input}>
                                <Icon name="ArrowUp" />
                                <span className="sr-only">Send message</span>
                            </Button>
                        </Tooltip>
                    )}
                </div>
            </div>
        </form>
    );
}
