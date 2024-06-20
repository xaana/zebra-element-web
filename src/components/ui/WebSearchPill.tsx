import React from "react";
import { Earth } from "lucide-react";

const WebSearchPill = (): React.JSX.Element | null => {
    return (
        <div className="inline-block px-2 py-1 bg-muted rounded-full">
            <div className="flex gap-2 text-xs">
                <Earth size={16} />
                <span>Web Search</span>
            </div>
        </div>
    );
};

export default WebSearchPill;
