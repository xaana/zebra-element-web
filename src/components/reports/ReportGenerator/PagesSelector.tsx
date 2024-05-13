import React from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/Icon";
const PagesSelector = ({
    pages,
    setPages,
}: {
    pages: number;
    setPages: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md py-1 px-2 border w-[120px] text-left bg-popover flex justify-between items-center">
                <span className="text-sm font-medium">
                    {pages} {pages === 1 ? "page" : "pages"}
                </span>
                <Icon name="ChevronDown" className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((pagesOption) => (
                    <DropdownMenuItem
                        key={pagesOption}
                        onClick={() => setPages(pagesOption)}
                        className="flex justify-between items-center"
                    >
                        {pagesOption} {pagesOption === 1 ? "page" : "pages"}
                        {pagesOption === pages && <Icon name="Check" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default PagesSelector;
