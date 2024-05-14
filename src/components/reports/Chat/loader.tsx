import React from "react";
import { ColorRing } from "react-loader-spinner";

import { cn } from "@/lib/utils";

export function Loader({
    className,
    height,
    width,
}: {
    className?: string;
    height?: string;
    width?: string;
}): JSX.Element {
    return (
        <div className={cn(className, "")}>
            <ColorRing
                visible={true}
                height={height || "30"}
                width={width || "30"}
                ariaLabel="blocks-loading"
                colors={["#fff", "#000", "#fff", "#000", "#fff"]}
                // colors={['#0A46FA', '#24FFFF', '#0A46FA', '#24FFFF', '#0A46FA']}
            />
        </div>
    );
}
