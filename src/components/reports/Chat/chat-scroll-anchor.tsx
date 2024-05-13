import * as React from "react";
import { useInView } from "react-intersection-observer";

interface ChatScrollAnchorProps {
    trackVisibility?: boolean;
}

export function ChatScrollAnchor({ trackVisibility }: ChatScrollAnchorProps): JSX.Element {
    const { ref, entry, inView } = useInView({
        trackVisibility: true,
        delay: 100,
        rootMargin: "0px 0px 500px 0px",
    });

    React.useEffect(() => {
        if (trackVisibility && !inView) {
            entry?.target.scrollIntoView({
                block: "start",
            });
        }
    }, [inView, entry, trackVisibility]);

    return <div ref={ref} className="h-px w-full" />;
}
