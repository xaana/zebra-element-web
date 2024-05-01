import React, { useEffect } from "react";

export const RingLoader = ({
    size = 24,
    speed = 1.66,
    color,
}: {
    size?: number | string;
    speed?: number | string;
    color?: string;
}): JSX.Element => {
    useEffect(() => {
        async function getLoader(): Promise<void> {
            const { ring } = await import("ldrs");
            ring.register();
        }
        getLoader();
    }, []);
    return (
        // eslint-disable-next-line
        <l-ring
            color={color ? color : "hsl(var(--primary))"}
            // color={color ? color : theme === 'dark' ? '#ffffff' : '#000000'}
            stroke={Number(size) * 0.125}
            size={size}
            speed={speed}
        ></l-ring>
    );
};
