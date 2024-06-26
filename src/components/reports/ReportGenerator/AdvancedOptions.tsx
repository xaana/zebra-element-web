import React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { MatrixFileSelector } from "@/components/reports/ReportGenerator/MatrixFileSelector";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Report } from "@/plugins/reports/types";
import { cn } from "@/lib/utils";
import { MatrixFile } from "@/plugins/files/types";
export const AdvancedOptions = ({
    allReports,
    contentFiles,
    setContentFiles,
    selectedTemplateId,
    setSelectedTemplateId,
}: {
    allReports: Report[];
    contentFiles: MatrixFile[];
    setContentFiles: React.Dispatch<React.SetStateAction<MatrixFile[]>>;
    selectedTemplateId: string | undefined;
    setSelectedTemplateId: React.Dispatch<React.SetStateAction<string | undefined>>;
}): JSX.Element => {
    const [templateSelectorOpen, setTemplateSelectorOpen] = React.useState(false);

    return (
        <Accordion type="single" collapsible className="w-auto m-0 p-0">
            <AccordionItem value="item-1" hideBorder={true} className="m-0 p-0">
                <AccordionTrigger className="w-auto m-0 p-0" hideIcon={true}>
                    <div className="flex items-center gap-1">
                        <Icon name="Settings" className="w-3 h-3" />
                        <span className="text-sm">Advanced Options</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="w-auto m-0 pt-2 pb-1 flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <div className="text-muted-foreground font-semibold text-xs">Supporting Documents:</div>
                        {contentFiles.length > 0 ? (
                            <div className="flex flex-wrap items-center justify-start gap-2">
                                {contentFiles.map((contentFile, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1 h-8">
                                        <div className="text-sm max-w-[120px] overflow-hidden whitespace-nowrap text-ellipsis">
                                            {contentFile.name}
                                        </div>
                                        <Button
                                            onClick={() =>
                                                setContentFiles((prev) => prev.filter((_, i) => i !== index))
                                            }
                                            variant="ghost"
                                            size="sm"
                                            className="w-auto h-auto p-0.5 rounded-full"
                                        >
                                            <Icon name="X" className="w-3 h-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <MatrixFileSelector contentFiles={contentFiles} setContentFiles={setContentFiles} />
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="text-muted-foreground font-semibold text-xs">Report Template:</div>
                        <Popover open={templateSelectorOpen} onOpenChange={setTemplateSelectorOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    role="combobox"
                                    aria-expanded={templateSelectorOpen}
                                    className="h-auto text-sm py-1 justify-between"
                                >
                                    {selectedTemplateId
                                        ? allReports.find((report) => report.id === selectedTemplateId)?.name
                                        : "New From Blank"}
                                    <CaretSortIcon className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder="Search report..."
                                        // className="h-9"
                                        className="text-xs placeholder:text-sm p-1"
                                    />
                                    <CommandList>
                                        <CommandEmpty>No report found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                value={undefined}
                                                onSelect={(currentValue) => {
                                                    setSelectedTemplateId(undefined);
                                                    setTemplateSelectorOpen(false);
                                                }}
                                            >
                                                New From Blank
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        selectedTemplateId === undefined ? "opacity-100" : "opacity-0",
                                                    )}
                                                />
                                            </CommandItem>
                                        </CommandGroup>
                                        <CommandSeparator />
                                        <CommandGroup>
                                            {allReports.map((report) => (
                                                <CommandItem
                                                    key={report.id}
                                                    value={report.name}
                                                    onSelect={(currentValue) => {
                                                        report.id !== selectedTemplateId &&
                                                            setSelectedTemplateId(report.id);
                                                        setTemplateSelectorOpen(false);
                                                    }}
                                                >
                                                    {report.name}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            selectedTemplateId === report.id
                                                                ? "opacity-100"
                                                                : "opacity-0",
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
