import React, { useEffect } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import styled from "styled-components";

import { MatrixFileSelector } from "@/components/reports/ReportGenerator/MatrixFileSelector";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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

const CollapsibleStyle = styled.div`
    .CollapsibleContent {
        overflow: hidden;
    }
    .CollapsibleContent[data-state="open"] {
        animation: slideDown 200ms ease-out;
    }
    .CollapsibleContent[data-state="closed"] {
        animation: slideUp 200ms ease-out;
    }

    @keyframes slideDown {
        from {
            height: 0;
        }
        to {
            height: var(--radix-collapsible-content-height);
        }
    }

    @keyframes slideUp {
        from {
            height: var(--radix-collapsible-content-height);
        }
        to {
            height: 0;
        }
    }
`;
export const AdvancedOptions = ({
    useAdvancedOptions,
    setUseAdvancedOptions,
    allReports,
    requirementDocuments,
    setRequirementDocuments,
    supportingDocuments,
    setSupportingDocuments,
    selectedTemplateId,
    setSelectedTemplateId,
}: {
    useAdvancedOptions: boolean;
    setUseAdvancedOptions: React.Dispatch<React.SetStateAction<boolean>>;
    allReports: Report[];
    requirementDocuments: MatrixFile[];
    setRequirementDocuments: React.Dispatch<React.SetStateAction<MatrixFile[]>>;
    supportingDocuments: MatrixFile[];
    setSupportingDocuments: React.Dispatch<React.SetStateAction<MatrixFile[]>>;
    selectedTemplateId: string | undefined;
    setSelectedTemplateId: React.Dispatch<React.SetStateAction<string | undefined>>;
}): JSX.Element => {
    const [showTemplateSelector, setShowTemplateSelector] = React.useState(false);
    const [listReport, setListReport] = React.useState<Report[]>([]);
    useEffect(() => {
        const namesList = [
            'Fujitsu Proposal Template - Green.docx'
            , 'Fujitsu Proposal Template - Blue.docx'
            , 'Fujitsu Proposal Template - Orange.docx'
            , 'Fujitsu Proposal Template - Red.docx'
            , 'Fujitsu Proposal Template - Yellow.docx'
        ];
        const temp = reverseArray(allReports)
        const filteredArray = temp.filter(obj => namesList.includes(obj.name));
        setSelectedTemplateId(filteredArray[0].id)
        setListReport(filteredArray)
    },[])
    const reverseArray = (arr:Report[]):Report[] => {
        const newArr = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            newArr.push(arr[i]);
        }
        return newArr;
    }
    return (
        <CollapsibleStyle>
            <Collapsible open={useAdvancedOptions} onOpenChange={setUseAdvancedOptions} className="w-full">
                <CollapsibleTrigger asChild>
                    <Button size="sm" variant="link" className="text-sm text-foreground mx-0 px-0 h-auto mt-1">
                        <Icon name="Settings" className="w-3 h-3 mr-1" />
                        Advanced Options
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent px-3 flex flex-col gap-3">
                    <div className="flex flex-col gap-1 mb-2 mt-2">
                        <div className="text-muted-foreground font-semibold text-sm">Requirements Specification</div>
                        <div className="text-xs text-muted-foreground font-normal mb-1.5">
                            Add documents specifying the requirements for this report
                        </div>
                        {requirementDocuments.length > 0 ? (
                            <div className="flex flex-wrap items-center justify-start gap-2">
                                {requirementDocuments.map((contentFile, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1 h-8">
                                        <div className="text-sm max-w-[120px] overflow-hidden whitespace-nowrap text-ellipsis">
                                            {contentFile.name}
                                        </div>
                                        <Button
                                            onClick={() =>
                                                setRequirementDocuments((prev) => prev.filter((_, i) => i !== index))
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
                            <MatrixFileSelector setSelectedFiles={setRequirementDocuments} />
                        )}
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                        <div className="text-muted-foreground font-semibold text-sm">Supporting Documents</div>
                        <div className="text-xs text-muted-foreground font-normal mb-1.5">
                            Add contextual documents to support content generation
                        </div>
                        {supportingDocuments.length > 0 ? (
                            <div className="flex flex-wrap items-center justify-start gap-2">
                                {supportingDocuments.map((contentFile, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1 h-8">
                                        <div className="text-sm max-w-[120px] overflow-hidden whitespace-nowrap text-ellipsis">
                                            {contentFile.name}
                                        </div>
                                        <Button
                                            onClick={() =>
                                                setSupportingDocuments((prev) => prev.filter((_, i) => i !== index))
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
                            <MatrixFileSelector setSelectedFiles={setSupportingDocuments} />
                        )}
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                        <div className="text-muted-foreground font-semibold text-sm">Style Template</div>
                        <div className="text-xs text-muted-foreground font-normal mb-1.5">
                            Select an existing report to use as a styling template
                        </div>
                        <Popover open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
                            <PopoverTrigger asChild className="w-[300px]">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    role="combobox"
                                    aria-expanded={showTemplateSelector}
                                    className="h-auto text-sm py-1 justify-between"
                                >
                                    {selectedTemplateId
                                        ? listReport.find((report) => report.id === selectedTemplateId)?.name
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
                                        {/* <CommandGroup>
                                            <CommandItem
                                                value={undefined}
                                                onSelect={(currentValue) => {
                                                    setSelectedTemplateId(undefined);
                                                    setShowTemplateSelector(false);
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
                                        </CommandGroup> */}
                                        <CommandSeparator />
                                        <CommandGroup>
                                            {listReport.map((report) => (
                                                <CommandItem
                                                    key={report.id}
                                                    value={report.name}
                                                    onSelect={(currentValue) => {
                                                        report.id !== selectedTemplateId &&
                                                            setSelectedTemplateId(report.id);
                                                        setShowTemplateSelector(false);
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
                </CollapsibleContent>
            </Collapsible>
        </CollapsibleStyle>
    );
};
