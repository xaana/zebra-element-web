import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

import { ColorButton } from "./ColorButton";

import { Toolbar } from "@/components/ui/Toolbar";
import { Icon } from "@/components/ui/Icon";
import { themeColors } from "@/lib/constants";

export type ColorPickerProps = {
    color?: string;
    onChange?: (color: string) => void;
    onClear?: () => void;
};

export const ColorPicker = ({ color, onChange, onClear }: ColorPickerProps) => {
    const [currentColor, setcurrentColor] = useState(color || "");

    const changeColor = (c: string) => {
        const isCorrectColor = /^#([0-9A-F]{3}){1,2}$/i.test(c);
        if (isCorrectColor) {
            setcurrentColor(c);
            onChange?.(c);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <HexColorPicker className="w-full" color={currentColor} onChange={changeColor} />
            <input
                type="text"
                className="w-full p-2 text-black bg-white border rounded dark:bg-black dark:text-white border-neutral-200 dark:border-neutral-800 focus:outline-1 focus:ring-0 focus:outline-neutral-300 dark:focus:outline-neutral-700"
                placeholder="#000000"
                value={currentColor}
                onChange={(e) => changeColor(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-1 max-w-[15rem]">
                {themeColors.map((currentColor) => (
                    <ColorButton
                        active={currentColor === color}
                        color={currentColor}
                        key={currentColor}
                        onColorChange={changeColor}
                    />
                ))}
                <Toolbar.Button tooltip="Reset color to default" onClick={onClear}>
                    <Icon name="Undo" />
                </Toolbar.Button>
            </div>
        </div>
    );
};
