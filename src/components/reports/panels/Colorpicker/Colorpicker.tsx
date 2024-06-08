import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

import { ColorButton } from "./ColorButton";

import { Toolbar } from "@/components/ui/Toolbar";
import { Icon } from "@/components/ui/Icon";
import { themeColors } from "@/lib/constants";

export type ColorPickerProps = {
    currentColor?: string;
    onChange?: (color: string) => void;
    onClear?: () => void;
};

export const ColorPicker = ({ currentColor, onChange, onClear }: ColorPickerProps): JSX.Element => {
    const [color, setColor] = useState(currentColor || "#000000");

    useEffect(() => {
        if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
            onChange?.(color);
        }
    }, [color]);

    return (
        <div className="flex flex-col gap-2">
            <HexColorPicker className="w-full" color={color} onChange={setColor} />
            <input
                type="text"
                className="w-full p-2 text-black bg-white border rounded dark:bg-black dark:text-white border-neutral-200 dark:border-neutral-800 focus:outline-1 focus:ring-0 focus:outline-neutral-300 dark:focus:outline-neutral-700"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-1 max-w-[15rem]">
                {themeColors.map((currentColor) => (
                    <ColorButton
                        active={currentColor === color}
                        color={currentColor}
                        key={currentColor}
                        onColorChange={(c) => setColor(c)}
                    />
                ))}
                <Toolbar.Button tooltip="Reset color to default" onClick={onClear}>
                    <Icon name="Undo" />
                </Toolbar.Button>
            </div>
        </div>
    );
};
