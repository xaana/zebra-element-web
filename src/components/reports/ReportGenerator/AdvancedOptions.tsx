import React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { FileUpload } from "@/components/reports/FileUpload";
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
import { File as MatrixFile } from "@/plugins/files/types";
export const AdvancedOptions = ({
    allReports,
    contentFile,
    setContentFile,
    selectedTemplateId,
    setSelectedTemplateId,
    onFileUpload,
}: {
    allReports: Report[];
    contentFile: File | undefined;
    setContentFile: React.Dispatch<React.SetStateAction<File | undefined>>;
    selectedTemplateId: string | undefined;
    setSelectedTemplateId: React.Dispatch<React.SetStateAction<string | undefined>>;
    onFileUpload: (file: File, matrixFile?: MatrixFile) => Promise<void>;
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
                        <div className="text-muted-foreground font-semibold text-xs">Supporting Document:</div>
                        {contentFile ? (
                            <Badge variant="outline" className="flex items-center gap-2 h-8">
                                <div className="text-sm">{contentFile.name}</div>
                                <Button
                                    onClick={() => setContentFile(undefined)}
                                    variant="ghost"
                                    size="sm"
                                    className="w-auto h-auto p-0.5 rounded-full"
                                >
                                    <Icon name="X" className="w-3 h-3" />
                                </Button>
                            </Badge>
                        ) : (
                            <FileUpload
                                onFileUpload={onFileUpload}
                                buttonText="Select Document"
                                allowUpload={false}
                                iconName="FileInput"
                                buttonVariant="outline"
                            />
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
