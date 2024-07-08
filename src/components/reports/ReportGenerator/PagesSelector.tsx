import React from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/Icon";

const options = {
    short: "Short Response",
    long: "Long Response",
};

const PagesSelector = ({
    responseLength,
    setResponseLength,
}: {
    responseLength: string;
    setResponseLength: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md my-2 py-2 px-2 border w-[200px] text-left bg-popover flex justify-between items-center">
                <span className="text-sm font-medium">
                    {responseLength ? options[responseLength] : "Select response length"}
                </span>
                <Icon name="ChevronDown" className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
                {Object.entries(options).map(([key, value]) => (
                    <DropdownMenuItem
                        key={key}
                        onClick={() => setResponseLength(key)}
                        className="flex justify-between items-center py-2"
                    >
                        {value}
                        {key === responseLength && <Icon name="Check" />}
                    </DropdownMenuItem>
                ))}
                {/*{Array.from({ length: 8 }, (_, i) => i + 1).map((pagesOption) => (*/}
                {/*    <DropdownMenuItem*/}
                {/*        key={pagesOption}*/}
                {/*        onClick={() => setPages(pagesOption)}*/}
                {/*        className="flex justify-between items-center"*/}
                {/*    >*/}
                {/*        {pagesOption} {pagesOption === 1 ? "section" : "sections"}*/}
                {/*        {pagesOption === pages && <Icon name="Check" />}*/}
                {/*    </DropdownMenuItem>*/}
                {/*))}*/}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PagesSelector;
