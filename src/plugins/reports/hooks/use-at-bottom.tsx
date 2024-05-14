import * as React from "react";

/**
 * Hook that returns whether the chat container is scrolled to the bottom.
 *
 * @param {number} offset - The offset value (default: 0)
 * @return {boolean} Returns true if the chat container is scrolled to the bottom, false otherwise
 */
export function useAtBottom(offset = 0): boolean {
    const [isAtBottom, setIsAtBottom] = React.useState(false);

    React.useEffect(() => {
        const container = document.getElementById("chat__container");
        const handleScroll = (): void => {
            container && setIsAtBottom(!(container.scrollTop < container.scrollHeight - container.clientHeight));
        };

        container && container.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            container && container.removeEventListener("scroll", handleScroll);
        };
    }, [offset]);

    return isAtBottom;
}
