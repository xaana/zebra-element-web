import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { v4 as uuid } from "uuid"; // for generating unique keys

import OutlineItem from "./OutlineItem";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Outline = ({
    pages,
    outlineItems,
    setOutlineItems,
    isOutlineLoading,
}: {
    pages: number;
    outlineItems: string[];
    setOutlineItems: React.Dispatch<React.SetStateAction<string[]>>;
    isOutlineLoading: boolean;
}): JSX.Element => {
    const moveCard = (dragIndex: number, hoverIndex: number): void => {
        setOutlineItems((prevItems: string[]) =>
            update(prevItems, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevItems[dragIndex] as string],
                ],
            }),
        );
    };
    return (
        <div>
            <div className="text-base text-muted-foreground font-semibold">Outline</div>
            <div className="mt-1 w-full bg-background p-3 rounded-md flex flex-col">
                {isOutlineLoading ? (
                    <div className="flex flex-col gap-3.5">
                        {Array.from({ length: pages }).map((_, index) => (
                            <Skeleton key={index} className="w-full h-[36px] rounded" />
                        ))}
                    </div>
                ) : (
                    <DndProvider backend={HTML5Backend}>
                        {outlineItems.map((outlineItem, index) => (
                            <div key={index}>
                                <OutlineItem
                                    id={uuid()}
                                    index={index}
                                    text={outlineItem}
                                    moveCard={moveCard}
                                    setOutlineItems={setOutlineItems}
                                />
                                {index !== outlineItems.length - 1 &&
                                    (outlineItems.length < 8 ? (
                                        <div className="relative w-full group">
                                            <Separator className="transition-all opacity-0 group-hover:opacity-100 bg-primary/80 w-full h-1 my-1 rounded" />
                                            <Button
                                                size="sm"
                                                variant="default"
                                                className="transition-all opacity-0 group-hover:opacity-100 absolute z-[1] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-auto h-auto py-0.5 px-1 rounded-full text-xs"
                                                onClick={() => {
                                                    const newOutlineItems = [...outlineItems]; // Create a copy of the array
                                                    newOutlineItems.splice(index + 1, 0, ""); // Insert an empty string after the current index
                                                    setOutlineItems(newOutlineItems); // Update the state with the new array
                                                }}
                                            >
                                                <Icon name="Plus" className="w-2 h-2" />
                                                Add page
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="h-3 w-full" />
                                    ))}
                            </div>
                        ))}
                        {outlineItems.length < 8 && (
                            <Button
                                variant="outline"
                                className="w-full mt-3"
                                onClick={() => setOutlineItems([...outlineItems, ""])}
                            >
                                <Icon name="Plus" className="w-4 h-4 mr-2" />
                                Add Page
                            </Button>
                        )}
                    </DndProvider>
                )}
            </div>
        </div>
    );
};

export default Outline;
