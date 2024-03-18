import * as React from "react";

import { cn } from "../../lib/utils";

export function IconChartDonut({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }}
            viewBox="0 0 256 256"
            {...props}
        >
            <path d="M137.39,24.06A16,16,0,0,0,120,40V80.67a15.86,15.86,0,0,0,13.25,15.76A32,32,0,1,1,96,129.68c-.41-8.22,1.27-15,5-20.26h0a15.86,15.86,0,0,0-1.69-20.47L71.69,60.68a16,16,0,0,0-23.63,1.1A103.6,103.6,0,0,0,55,202.05,103.24,103.24,0,0,0,128,232h1.49A104.3,104.3,0,0,0,232,129.48C232.75,75.18,191.19,28.88,137.39,24.06ZM60.32,71.94l27.61,28.19,0,.06A43.29,43.29,0,0,0,80.44,120H40.36A87.13,87.13,0,0,1,60.32,71.94ZM40.37,136h40.3A48,48,0,0,0,120,175.34v40.3A88,88,0,0,1,40.37,136Zm149.77,54.14A87.45,87.45,0,0,1,136,215.61V175.34a47.55,47.55,0,0,0,24.73-12.23A48,48,0,0,0,136,80.66L136,40c45.52,4.08,80.67,43.28,80,89.25A87.45,87.45,0,0,1,190.14,190.14Z" />
        </svg>
    );
}

export function IconZoomIn({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 256 256"
            {...props}
        >
            <path d="M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" />
        </svg>
    );
}
export function IconZoomOut({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 256 256"
            {...props}
        >
            <path d="M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z" />
        </svg>
    );
}

export function IconTable({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 256 256"
            {...props}
        >
            <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z" />
        </svg>
    );
}

export function IconHeadphones({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="#737D8C"
            className={cn("h-4 w-4", className)}
            {...props}
        >
            <path d="M232,136v56a24,24,0,0,1-24,24H192a24,24,0,0,1-24-24V152a24,24,0,0,1,24-24h23.65a87.71,87.71,0,0,0-87-80H128a88,88,0,0,0-87.64,80H64a24,24,0,0,1,24,24v40a24,24,0,0,1-24,24H48a24,24,0,0,1-24-24V136A104.11,104.11,0,0,1,201.89,62.66,103.41,103.41,0,0,1,232,136Z" />
        </svg>
    );
}

export function IconMicrophone({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#737D8C"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 256 256"
            {...props}
        >
            <path d="M80,128V64a48,48,0,0,1,96,0v64a48,48,0,0,1-96,0Zm128,0a8,8,0,0,0-16,0,64,64,0,0,1-128,0,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V232a8,8,0,0,0,16,0V207.6A80.11,80.11,0,0,0,208,128Z" />
        </svg>
    );
}

export function IconVideoFilled({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={props.fill || "currentColor"}
            className={cn("h-4 w-4", className)}
            viewBox="0 0 32 32"
            {...props}
        >
            <path d="M21 26H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h17a2 2 0 0 1 2 2v4.06l5.42-3.87A1 1 0 0 1 30 9v14a1 1 0 0 1-1.58.81L23 19.94V24a2 2 0 0 1-2 2z" />
        </svg>
    );
}

export function IconDocumentDuplicate({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={props.fill || "currentColor"}
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
            <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
        </svg>
    );
}

export function IconFileChartFill({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={props.fill || "currentColor"}
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path d="M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM11 7V17H13V7H11ZM15 11V17H17V11H15ZM7 13V17H9V13H7Z" />
        </svg>
    );
}
