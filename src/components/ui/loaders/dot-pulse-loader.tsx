import React, { useEffect } from "react";
// import { useTheme } from '@/context/ThemeContext'

export default function DotPulseLoader({
    size = 30,
    speed = 1,
    color = "hsl(220 8.9% 46.1%)",
}: {
    size?: number | string;
    speed?: number | string;
    color?: string;
}): JSX.Element {
    // const { theme } = useTheme()
    useEffect(() => {
        async function getLoader(): Promise<void> {
            const { dotPulse } = await import("ldrs");
            dotPulse.register();
        }
        getLoader();
    }, []);
    return (
        <div className="pb-2 pt-1">
            <l-dot-pulse
                // color={color ? color : theme === 'dark' ? '#ffffff' : '#000000'}
                color={color ? color : "#000000"}
                size={size}
                speed={speed}
            />
        </div>
    );
}
