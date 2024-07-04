import * as React from "react";

import { cn } from "@/lib/utils";

export function IconEllipses({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    );
}

export function IconStarAdd({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <g fill="none">
                <path
                    d="M10.788 3.102c.495-1.003 1.926-1.003 2.421 0l2.358 4.778l5.273.766c1.107.16 1.549 1.522.748 2.303l-.905.882a6.462 6.462 0 0 0-1.517-.616l1.157-1.128l-5.05-.734a1.35 1.35 0 0 1-1.016-.739L11.998 4.04L9.74 8.614a1.35 1.35 0 0 1-1.016.739l-5.05.734l3.654 3.562c.318.31.463.757.388 1.195l-.862 5.029l4.149-2.181c.015.542.098 1.067.238 1.569l-3.958 2.081c-.99.52-2.148-.32-1.96-1.423l.901-5.251l-3.815-3.72c-.801-.78-.359-2.141.748-2.302L8.43 7.88l2.358-4.778zM23 17.5a5.5 5.5 0 1 0-11 0a5.5 5.5 0 0 0 11 0zm-5 .5l.001 2.503a.5.5 0 1 1-1 0V18h-2.505a.5.5 0 0 1 0-1H17v-2.501a.5.5 0 0 1 1 0v2.5h2.497a.5.5 0 0 1 0 1H18z"
                    fill="currentColor"
                />
            </g>
        </svg>
    );
}

export function IconStarFilled({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <g fill="none">
                <path
                    d="M10.788 3.102c.495-1.003 1.926-1.003 2.421 0l2.358 4.778l5.273.766c1.107.16 1.549 1.522.748 2.303l-3.816 3.719l.901 5.25c.19 1.104-.968 1.945-1.959 1.424l-4.716-2.48l-4.715 2.48c-.99.52-2.148-.32-1.96-1.423l.901-5.251l-3.815-3.72c-.801-.78-.359-2.141.748-2.302L8.43 7.88l2.358-4.778z"
                    fill="currentColor"
                />
            </g>
        </svg>
    );
}

export function IconStar({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <g fill="none">
                <path
                    d="M10.788 3.102c.495-1.003 1.926-1.003 2.421 0l2.358 4.778l5.273.766c1.107.16 1.549 1.522.748 2.303l-3.816 3.719l.901 5.25c.19 1.104-.968 1.945-1.959 1.424l-4.716-2.48l-4.715 2.48c-.99.52-2.148-.32-1.96-1.423l.901-5.251l-3.815-3.72c-.801-.78-.359-2.141.748-2.302L8.43 7.88l2.358-4.778zm1.21.937L9.74 8.614a1.35 1.35 0 0 1-1.016.739l-5.05.734l3.654 3.562c.318.31.463.757.388 1.195l-.862 5.029l4.516-2.375a1.35 1.35 0 0 1 1.257 0l4.516 2.375l-.862-5.03a1.35 1.35 0 0 1 .388-1.194l3.654-3.562l-5.05-.734a1.35 1.35 0 0 1-1.016-.739L11.998 4.04z"
                    fill="currentColor"
                />
            </g>
        </svg>
    );
}

export function IconShortText({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path
                d="M5 9h14c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h8c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1z"
                fill="currentColor"
            />
        </svg>
    );
}

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

export function IconCheckBold({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            {...props}
        >
            <path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z" />
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

export function IconDocumentPDF({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5M3 12h1.5c2 0 2.25 1.25 2.25 2s-.25 2-2.25 2H3.25v2H3v-6zm6.5 6v-6h1.705c1.137 0 2.295.5 2.295 3s-1.158 3-2.295 3H9.5zm7 1v-7h4m-4 3.5h3"
            />
        </svg>
    );
}
export function IconDocumentCSV({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5M7 13H5c-1 0-2 .5-2 1.5v3c0 1 1 1.5 2 1.5h2m6.25-6h-2.5c-1.5 0-2 .5-2 1.5s.5 1.5 2 1.5 2 .5 2 1.5-.5 1.5-2 1.5h-2.5m12.25-7v.5C20.5 13 18 19 18 19h-.5S15 13 15 12.5V12"
            />
        </svg>
    );
}
export function IconDocumentZip({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5M2 13h5v1l-4 4v1h5m3-7v8-8zm4 1v7-7zm5 2a2 2 0 0 0-2-2h-3v4h3a2 2 0 0 0 2-2z"
            />
        </svg>
    );
}
export function IconDocumentWord({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5m-9 6-1.5 6.75h-.25L9.5 12H9l-2.75 6.75H6L4.5 12H4l2 7h.5L9 12.5h.5L12 19h.5l2-7H14z"
            />
        </svg>
    );
}
export function IconDocumentEXE({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5m-8.75 5.5-6 7m0-7 6 7M20.5 12h-4v6h4m-1-3h-3M7 12H3v6h4m-1-3H3"
            />
        </svg>
    );
}
export function IconDocumentTXT({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5M2 12h5m-2.5 0v7M16 12h5m-2.5 0v7m-4-7.5-6 7m0-7 6 7"
            />
        </svg>
    );
}

export function IconTurium({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("", className)}
            viewBox="0 0 232.66 250.59"
            {...props}
        >
            <path d="M24.38,36.16c3.4,2.72,6.54,5.16,9.62,7.64,2.38,1.92,4.66,4,7,5.83A3.85,3.85,0,0,1,42.67,53c-.05,12.86,0,25.71-.07,38.56a3.93,3.93,0,0,0,1.9,3.66c10.93,7.62,21.8,15.34,32.69,23l29,20.45c1.85,1.31,3.71,2.62,5.64,3.8a3.2,3.2,0,0,1,1.61,3.16q-.18,41-.23,82a3.07,3.07,0,0,1-1.63,2.91c-8.83,5.79-17.82,11.37-26.34,17.52-3.37,2.43-5.58,2.41-8.78.08-4.69-3.41-9.7-6.41-14.63-9.49Q41.11,225.79,20.36,213a3.73,3.73,0,0,1-2-3.61c.06-10,0-20,.07-30a4.27,4.27,0,0,0-2-3.9C11.72,172,7,168.42,2.29,165A4.65,4.65,0,0,1,0,160.74q.12-28.55,0-57.1A4.1,4.1,0,0,1,1.62,100c5.44-4.4,10.79-8.88,16.7-13.73v3q0,31.11,0,62.22a4,4,0,0,0,2,3.84c2.6,1.71,5.11,3.59,7.58,5.48a2,2,0,0,0,2.64.2c6.72-4.37,13.5-8.62,20.19-13,1.44-1,2.44-1.14,3.9,0,3.74,3,7.66,5.86,11.49,8.79.77.57,1.48,1.26,2.4,2-5.69,3.67-11.13,7.21-16.58,10.76-4.4,2.84-8.77,5.77-13.2,8.58a3,3,0,0,0-1.56,2.94q.1,9.27,0,18.54a3,3,0,0,0,1.58,2.91Q58.87,215.23,79,228a2.71,2.71,0,0,0,3.58-.07c3.41-2.45,6.92-4.7,10.28-7.19a3.94,3.94,0,0,0,1.49-2.69c.15-20.94.18-41.9.29-62.85A3.2,3.2,0,0,0,93,152.29q-20.58-14.56-41.1-29.18c-8.73-6.2-17.48-12.37-26.14-18.64a3.9,3.9,0,0,1-1.5-2.71q-.12-32-.06-63.92C24.19,37.42,24.27,37,24.38,36.16Z" />
            <path d="M208.56,36.07v2.59q0,31.11,0,62.22a4.34,4.34,0,0,1-2,4q-23.87,16.86-47.69,33.86-9.52,6.82-19.12,13.48a3.35,3.35,0,0,0-1.66,3.13q.16,31.22.19,62.42a3.3,3.3,0,0,0,1.71,3.11q5.25,3.41,10.34,7.1a2.43,2.43,0,0,0,3.2.12q20.28-12.9,40.64-25.65a2.82,2.82,0,0,0,1.46-2.75c-.07-6.11-.09-12.22,0-18.33a3.47,3.47,0,0,0-1.84-3.41q-14.61-9.31-29.12-18.81c-.1-.07-.15-.23-.36-.56,2.11-1.61,4.22-3.23,6.36-4.84,2.54-1.94,5.11-3.8,7.6-5.82a2.41,2.41,0,0,1,3.36-.16c6.71,4.36,13.52,8.59,20.22,13a2.42,2.42,0,0,0,3.35-.18c2.38-1.88,4.83-3.71,7.36-5.42a3.73,3.73,0,0,0,1.73-3.54q-.08-31.11,0-62.21v-3c.9.66,1.47,1,2,1.43,5.11,4.25,10.28,8.48,15.34,12.79a3.14,3.14,0,0,1,1,2.1q.07,29.5,0,59a3.79,3.79,0,0,1-1.4,2.55c-5,3.85-10,7.65-15.17,11.33a4,4,0,0,0-1.81,3.72c.06,9.8,0,19.6.06,29.41a4.62,4.62,0,0,1-2.38,4.48c-12.06,7.58-24,15.34-36,23-7.47,4.71-15.09,9.22-22.6,13.89a2.19,2.19,0,0,1-2.84,0c-3.11-2.23-6.25-4.42-9.45-6.52q-9.84-6.48-19.75-12.84a3.24,3.24,0,0,1-1.71-3.09q-.06-40.91-.25-81.82a3.4,3.4,0,0,1,1.54-3.2c10.12-7.06,20.16-14.2,30.25-21.31q18.62-13.07,37.29-26.1a3.71,3.71,0,0,0,1.78-3.49c-.06-12.92,0-25.85-.07-38.78a3.64,3.64,0,0,1,1.54-3.21c5.11-4.07,10.12-8.22,15.18-12.34C207.23,37,207.69,36.72,208.56,36.07Z" />
            <path d="M119.45,126.56v-2.93q0-52.27,0-104.56A3.91,3.91,0,0,1,121.89,15Q135.76,7.91,149.53.5a3.47,3.47,0,0,1,3.88.2q18.48,10.89,37,21.68c3.6,2.1,7.2,4.17,11,6.39l-7,6.53c-.74.68-1.47,1.34-2.23,2-1.78,1.49-3.46,3.93-5.4,4.15s-4-1.85-5.9-3q-14.22-8.3-28.42-16.64a2.87,2.87,0,0,0-3.3-.13q-4.64,2.59-9.43,4.87a2.92,2.92,0,0,0-1.87,3.1c.05,25.91,0,51.82.1,77.73a7,7,0,0,1-2.91,6.25c-4.63,3.62-9,7.53-13.54,11.32C121.05,125.38,120.48,125.78,119.45,126.56Z" />
            <path d="M113.13,126.61c-6.1-5.16-11.86-10-17.51-14.9a4,4,0,0,1-.74-2.68q-.06-39.42,0-78.84c0-1.94-.49-3.07-2.32-3.9-3.22-1.47-6.29-3.27-9.48-4.8a2.85,2.85,0,0,0-2.27.08Q65.58,30.32,50.48,39.23c-4.65,2.76-4.59,2.89-8.57-.71C38.43,35.4,35,32.27,31.23,28.86c3-1.78,5.65-3.41,8.36-5q15.4-9,30.83-18C73.6,4,76.8,2.11,80.08.41a3.3,3.3,0,0,1,2.65,0c9.66,5,19.22,10.05,28.84,15a2.72,2.72,0,0,1,1.78,2.75q-.06,53.27,0,106.53C113.3,125.16,113.22,125.64,113.13,126.61Z" />
        </svg>
    );
}

export function IconDocumentText({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M6 16h10H6zm0-4h12H6zm0-4h5-5zm8-7v7h7M3 23V1h12l6 6v16H3z"
            />
        </svg>
    );
}
export function IconDocumentDB({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 7V1H19.5L23 4.5V23h-6m1-22v5h5M3 12s1-2 6-2 6 2 6 2v9s-1 2-6 2-6-2-6-2v-9zm0 5s2 2 6 2 6-2 6-2M3 13s2 2 6 2 6-2 6-2"
            />
        </svg>
    );
}
export function IconDocumentPPT({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5M4 12h1.5c2 0 3.5.5 3.5 2.25S7.5 16.5 5.5 16.5H4.25V19H4v-7z"
            />
        </svg>
    );
}
export function IconDocumentRTF({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5m-2.5 6h-4v7m3-3.5h-3m-8-3.5h6m-3 0v7M3 19v-7h1.5C5 12 7 12 7 14s-2 2-2.5 2H3m2.25 0 2.25 3"
            />
        </svg>
    );
}
export function IconDocument({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path fill="none" stroke="currentColor" strokeWidth={2} d="M14 1v7h7m0 15H3V1h12l3 3 3 3v16z" />
        </svg>
    );
}
export function IconDocumentExcel({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                d="M4.998 9V1H19.5L23 4.5V23H4M18 1v5h5M9.25 12l-2 3.25-2-3.25H5l2.25 3.5-2.5 3.5H5l2.25-3.25L9.5 19h.25l-2.5-3.5L9.5 12h-.25z"
            />
        </svg>
    );
}

export function IconStop({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="currentColor"
            className={cn("zexa-h-4 zexa-w-4", className)}
            {...props}
        >
            <path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm32-104v40a12,12,0,0,1-12,12H108a12,12,0,0,1-12-12V108a12,12,0,0,1,12-12h40A12,12,0,0,1,160,108Z" />
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

export function IconVideo({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className={cn("h-6 w-6", className)}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
            <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
    );
}

export function IconPdfDoc({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={props.fill || "currentColor"}
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path d="M5 4H15V8H19V20H5V4ZM3.9985 2C3.44749 2 3 2.44405 3 2.9918V21.0082C3 21.5447 3.44476 22 3.9934 22H20.0066C20.5551 22 21 21.5489 21 20.9925L20.9997 7L16 2H3.9985ZM10.4999 7.5C10.4999 9.07749 10.0442 10.9373 9.27493 12.6534C8.50287 14.3757 7.46143 15.8502 6.37524 16.7191L7.55464 18.3321C10.4821 16.3804 13.7233 15.0421 16.8585 15.49L17.3162 13.5513C14.6435 12.6604 12.4999 9.98994 12.4999 7.5H10.4999ZM11.0999 13.4716C11.3673 12.8752 11.6042 12.2563 11.8037 11.6285C12.2753 12.3531 12.8553 13.0182 13.5101 13.5953C12.5283 13.7711 11.5665 14.0596 10.6352 14.4276C10.7999 14.1143 10.9551 13.7948 11.0999 13.4716Z" />
        </svg>
    );
}

export function IconWordDoc({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={props.fill || "currentColor"}
            className={cn("h-4 w-4", className)}
            viewBox="0 0 24 24"
            {...props}
        >
            <path d="M16 8V16H14L12 14L10 16H8V8H10V13L12 11L14 13V8H15V4H5V20H19V8H16ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918Z" />
        </svg>
    );
}

// export function IconDocumentDuplicate({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill={props.fill || "currentColor"}
//             className={cn("h-4 w-4", className)}
//             viewBox="0 0 24 24"
//             {...props}
//         >
//             <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
//             <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
//         </svg>
//     );
// }

export function IconDocumentDuplicate({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className={cn("h-6 w-6", className)}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
            <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
            <path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" />
        </svg>
    );
}

// export function IconFileChartFill({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill={props.fill || "currentColor"}
//             className={cn("h-4 w-4", className)}
//             viewBox="0 0 24 24"
//             {...props}
//         >
//             <path d="M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM11 7V17H13V7H11ZM15 11V17H17V11H15ZM7 13V17H9V13H7Z" />
//         </svg>
//     );
// }

export function IconFileChart({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className={cn("h-6 w-6", className)}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M8 18v-1" />
            <path d="M12 18v-6" />
            <path d="M16 18v-3" />
        </svg>
    );
}

export function IconDatabase({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#737d8c"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-database"
        >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5V19A9 3 0 0 0 21 19V5" />
            <path d="M3 12A9 3 0 0 0 21 12" />
        </svg>
    );
}

export function IconAlgology({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className={cn("h-6 w-6", className)}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
    );
}

export function IconCalendar({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-calendar-days"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
        </svg>
    );
}

export function IconZebra({ className, ...props }: React.ComponentProps<"svg">): JSX.Element {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className={cn("", className)}
            viewBox="0 0 329.27 266.14"
            {...props}
        >
            <path d="M188,0c1.45,2,2.91,4.06,4.34,6.11,4.45,6.39,8.18,13.11,10.12,20.72A25.83,25.83,0,0,1,202,41a73.16,73.16,0,0,1-9.44,19.75A19.08,19.08,0,0,1,187,65.91a5.19,5.19,0,0,1-1,.49c-1.55.62-2.64.11-3-1.53a16.93,16.93,0,0,1-.43-3c-.34-5.87-.63-11.74-1-17.61s-.69-12-1-17.93c0-.43-.12-.85-.21-1.43a27.65,27.65,0,0,0-6.57,4.78,24.27,24.27,0,0,0-6.71,17.19,21.32,21.32,0,0,0,2.33,8.77,53.71,53.71,0,0,0,8.41,12.79,37.76,37.76,0,0,1,7.91,15.1c1.57,5.58,3.49,11.07,5.16,16.63a37.32,37.32,0,0,1,.81,4.65l-.38.27a14.74,14.74,0,0,1-2.72-1.37c-4.18-3.35-8.36-6.72-12.44-10.2q-8.49-7.25-16.82-14.67c-5.53-4.93-11.8-8.77-18.19-12.44-2.5-1.45-4.59-1.16-6.69,1q-12.42,12.5-24.79,25-10,10.08-19.92,20.16-5.4,5.46-10.77,11c-.32.33-.63.67-1.11,1.2,1.55.17,2.86.33,4.18.45,5.06.46,10.13.77,15.17,1.39,6.65.81,13.3,1.72,19.91,2.82a148.57,148.57,0,0,1,25.19,6.31,54.78,54.78,0,0,1,16,8.27,21.39,21.39,0,0,1,7.89,13.51c1.29,7.19-.27,14.07-2.49,20.85a106.44,106.44,0,0,1-10.81,22.38c-.62,1-1.3,2-1.88,3a3,3,0,0,1-2.54,1.59c-3.66.3-7.3.64-11,.93-4.74.37-9.48.7-14.22,1-.39,0-.78,0-1.34,0,.2-.73.35-1.35.55-1.95,2.4-7,4.88-14,7.2-21.1A61.33,61.33,0,0,0,133,163.58a21.33,21.33,0,0,0-1.43-8.1c-1.71-4-5.19-5.81-9-7.32-5.52-2.19-11.35-3-17.11-4.06-7.3-1.39-14.62-2.7-21.94-4-3.78-.68-7.56-1.35-11.36-1.93a9.58,9.58,0,0,0-2.92.12c-1.41.22-2.09,1.61-2,3.52a5.83,5.83,0,0,0,4.41,5.59c6.18,2,12.38,3.9,18.59,5.82,4.74,1.47,9.48,3,14.26,4.34,5.45,1.55,8.28,5.29,9.3,10.66a36.32,36.32,0,0,1-.1,12.13c-1.28,8.76-4,17.14-6.84,25.49a2.6,2.6,0,0,1-2.43,2c-4.65.52-9.29,1.12-13.94,1.68-.25,0-.51,0-.76.05-.89.14-1.11-.29-.89-1.07,1-3.42,1.9-6.85,2.87-10.26q2.48-8.74,5-17.48a13,13,0,0,0,.35-6.56c-.84-3.76-3.58-5.76-7-6.72q-7.38-2.07-14.89-3.66-10.91-2.33-21.88-4.27a50.92,50.92,0,0,0-7.92-.52,3.27,3.27,0,0,0-3.42,2.9,3.09,3.09,0,0,0,1.95,3.52,58.76,58.76,0,0,0,17.26,5.78c4.27.64,8.53,1.33,12.75,2.21a9.77,9.77,0,0,1,7,4.92,14,14,0,0,1,1.44,7.5C82,192.91,79,199.08,75.26,205c-1.49,2.36-3.09,4.65-4.69,6.93a11.51,11.51,0,0,1-6.35,4.36c-7,2.07-14,4.09-21,6.15-4.79,1.4-9.47.86-14.14-.59C17.2,218.13,8.41,210.62,2.32,199.9c-3.62-6.36-2.89-12.53,1.41-18.34A183.41,183.41,0,0,1,22,160.3c3.79-3.76,7.74-7.36,11.44-11.21,2.91-3,5.49-6.36,8.33-9.47,2.54-2.79,5.21-5.46,7.85-8.17q14.4-14.79,28.83-29.56,9-9.17,17.93-18.29Q108,71.78,119.63,60a123.08,123.08,0,0,1,8.91-8.79,18,18,0,0,1,13.57-3.9c2.22.2,4.42.58,6.7.89-.12-1.09-.28-2.05-.3-3,0-2.47,1.05-4.64,1.94-6.85A51.64,51.64,0,0,1,166,17.17C171.21,13,176.29,8.61,181.47,4.4c1.94-1.58,4.05-2.94,6.08-4.4Z" />
            <path d="M329.27,145.63c-3.09,3.88-6.16,7.78-9.29,11.63q-5.84,7.17-11.77,14.27c-3.73,4.45-7.48,8.88-11.3,13.25q-6,6.89-12.2,13.63c-8,8.76-16.16,17.31-24.83,25.39C254.44,228.87,249,234,243.3,238.74c-7.22,6-14.69,11.74-22.17,17.43-3.78,2.88-7.8,5.44-11.75,8.09a9.2,9.2,0,0,1-6.54,1.15c.7-1.13,1.28-2.16,2-3.12,8.49-12.2,17-24.37,25.5-36.59,5.91-8.52,11.73-17.1,17.6-25.65,13-18.89,25.84-37.86,39-56.64,5.69-8.12,12-15.84,18-23.74a5.19,5.19,0,0,1,.62-.58c1.34,1.46,2.64,2.86,3.93,4.28l19.5,21.57a2.8,2.8,0,0,0,.35.25Z" />
            <path d="M197.83,145.52c.13-1,.29-2,.39-3.07q1.2-11.64,2.38-23.27c.61-6.1,1.2-12.2,1.82-18.3s1.26-12,1.88-18.07c.48-4.65.91-9.31,1.39-14,.61-6,1.26-12,1.88-18.07s1.21-12.06,1.81-18.08c.14-1.38.27-2.75.43-4.12,0-.27.14-.73.26-.74a1.27,1.27,0,0,1,.86.26c1.26,1,2.45,2.16,3.73,3.18a55.18,55.18,0,0,0,15.14,8.21,39.82,39.82,0,0,1,11.37,6.07,4.91,4.91,0,0,1,2.06,5.15c-.63,3.79-.79,7.65-1.39,11.45-1,6.12-2,12.24-3.19,18.32-3.31,16.73-8.46,32.94-14,49.05q-10.77,31.64-21.34,63.33c-1.7,5.06-3.34,10.13-5,15.2-.09.3-.14.61-.21.92l.25.1Q231,139,263.68,68.64c1.62,1.73,3.17,3.19,4.49,4.84,5,6.33,10,12.73,15,19.1,1.07,1.37,2.18,2.71,3.28,4.06a4.73,4.73,0,0,1,.72,5.2c-1.69,3.89-3.3,7.82-5.11,11.66-3.3,7-6.61,14-10.12,20.85a339.71,339.71,0,0,1-17.73,31.19c-7.77,11.94-15.74,23.75-23.78,35.51-8.4,12.26-17,24.39-25.5,36.58q-9.6,13.73-19.22,27.44c-.2.29-.43.56-.81,1.07-.31-.73-.59-1.25-.77-1.81-2.94-9.53-5.85-19.08-8.81-28.6q-3.92-12.58-7.95-25.12a13.29,13.29,0,0,1,1.32-11.17,72.33,72.33,0,0,0,9.11-26.14,61.73,61.73,0,0,0-4.67-33c-3.31-7.72-8.23-14.29-13.81-20.48-8.48-9.41-17.05-18.76-24.39-29.12a60.53,60.53,0,0,1-4.29-7.29,3.6,3.6,0,0,1,.79-4.67,4,4,0,0,1,3.94-.49c4.07,1.42,8.16,2.81,12.14,4.46A80.73,80.73,0,0,1,163,91.34a72.07,72.07,0,0,1,22.43,25.39,184.36,184.36,0,0,1,10.41,23.81c.6,1.67,1.2,3.33,1.79,5Z" />
        </svg>
    );
}
