import React from "react";
import { useDrag, useDrop } from "react-dnd";

import type { Identifier, XYCoord } from "dnd-core";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define item type for drag and drop
const ItemTypes = {
    ITEM: "item",
};

// Interface for each draggable item
interface DragItem {
    id: string;
    text: string;
    index: number;
}

// Interface for each draggable item
interface ItemProps {
    id: string;
    text: string;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    setOutlineItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

const OutlineItem = ({ id, text, index, moveCard, setOutlineItems }: ItemProps): JSX.Element => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
        accept: ItemTypes.ITEM,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();

            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            // Determine mouse position
            const clientOffset = monitor.getClientOffset();

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex);

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.ITEM,
        item: () => {
            return { id, index };
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));
    return (
        <div
            ref={ref}
            style={{ opacity }}
            data-handler-id={handlerId}
            className="group relative w-full rounded-md border flex items-center overflow-hidden transition-all outline-none hover:outline-primary hover:-outline-offset-2"
        >
            <div
                className={cn(
                    "bg-violet-200/70 relative flex justify-center items-center h-9 font-medium text-xs text-violet-600 min-w-8 cursor-move",
                )}
            >
                {index + 1}
                <Icon name="GripVertical" className="w-3 h-3 absolute left-0.5 opacity-0 group-hover:opacity-55" />
            </div>
            <input
                value={text}
                onChange={(e) =>
                    setOutlineItems((prev) => prev && prev.map((item, id) => (id === index ? e.target.value : item)))
                }
                placeholder="Add page title..."
                className="bg-card border-none w-full focus-within:outline-none focus-within:bg-popover p-2 text-sm"
            />
            <Button
                className="transition-all opacity-0 group-hover:opacity-100 h-auto w-auto p-1 rounded-full absolute right-2 top-1/2 -translate-y-1/2"
                variant="ghost"
                size="sm"
                onClick={() => setOutlineItems((prev) => prev && prev.filter((_, id) => id !== index))}
            >
                <Icon name="Trash2" className="w-3.5 h-3.5 text-muted-foreground hover:text-primary-default" />
            </Button>
        </div>
    );
};

export default OutlineItem;
