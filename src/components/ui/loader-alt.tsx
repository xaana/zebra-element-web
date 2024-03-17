import { ColorRing } from "react-loader-spinner";
import React from "react";

import { cn } from "../../lib/utils";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function Loader({ className, height, width }: { className?: string; height?: string; width?: string }) {
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
