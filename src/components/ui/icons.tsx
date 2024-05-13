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
            width="720"
            height="720"
            viewBox="0 0 720 720"
            xmlns="http://www.w3.org/2000/svg"
            fill={props.fill || "currentColor"}
            className={cn("h-4 w-4", className)}
            {...props}
        >
            <g id="Group-copy-2">
                <g id="Group-copy-3">
                    <linearGradient
                        id="linearGradient1"
                        x1="261.641254"
                        y1="405.305952"
                        x2="230.985057"
                        y2="371.987093"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1c438b" stopOpacity="1" />
                        <stop offset="1" stopColor="#53b6f9" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="Shape"
                        fill="url(#linearGradient1)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 260.29364 318.592743 L 260.29364 414.493805 L 235.056519 398.674072 L 235.056519 335.653687 Z"
                    />
                    <linearGradient
                        id="linearGradient2"
                        x1="277.986996"
                        y1="409.618151"
                        x2="309.896066"
                        y2="401.74393"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1c438b" stopOpacity="1" />
                        <stop offset="1" stopColor="#53b6f9" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path1"
                        fill="url(#linearGradient2)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 260.477966 407.899139 L 300.183197 384.372131 L 320.857727 398.894348 L 276.055603 427.754883 Z"
                    />
                    <linearGradient
                        id="linearGradient3"
                        x1="260.946282"
                        y1="433.502583"
                        x2="329.824403"
                        y2="433.502583"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#53b6f9" stopOpacity="1" />
                        <stop offset="1" stopColor="#1c438b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path2"
                        fill="url(#linearGradient3)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 325.632813 489.603516 L 260.248047 447.875 L 260.601563 447.302734 L 260.292969 447.302734 L 260.292969 390.251953 L 260.292969 377.478516 L 285.53125 393.015625 L 285.53125 434.074219 L 335.832031 466.175781 L 342.982422 469.876953 L 325.632813 489.603516 Z"
                    />
                    <linearGradient
                        id="linearGradient4"
                        x1="275.937905"
                        y1="296.907929"
                        x2="332.526327"
                        y2="365.499651"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#53b6f9" stopOpacity="1" />
                        <stop offset="1" stopColor="#1c438b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path3"
                        fill="url(#linearGradient4)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 341.378906 393.533203 L 265.744141 337.697266 L 266.181641 337.105469 L 266.181641 268.958984 L 291.419922 290.757813 L 291.419922 325.283203 L 356.367188 373.230469 L 341.378906 393.533203 Z"
                    />
                    <linearGradient
                        id="linearGradient5"
                        x1="273.293201"
                        y1="256.466635"
                        x2="337.738294"
                        y2="256.466635"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#53b6f9" stopOpacity="1" />
                        <stop offset="1" stopColor="#1c438b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path4"
                        fill="url(#linearGradient5)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 273.293213 261.815094 L 324.301666 232.038879 L 337.043976 238.63681 L 337.738281 253.401703 L 295.559143 280.894409 Z"
                    />
                    <linearGradient
                        id="linearGradient6"
                        x1="350.764928"
                        y1="425.914436"
                        x2="351.439981"
                        y2="360.892473"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#3478f6" stopOpacity="1" />
                        <stop offset="1" stopColor="#53b6f9" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path5"
                        fill="url(#linearGradient6)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 325.341797 489.962891 C 325.341797 489.962891 325.791534 489.151733 327.962891 486.644531 C 329.715027 484.62146 330.941528 477.921906 330.931641 477.039063 C 330.893311 473.619385 330.957031 473.324219 330.957031 473.324219 L 330.957031 378.574219 C 330.957031 378.574219 330.910065 373.902283 330.931641 366.658203 C 330.94632 361.726807 330.020966 355.765015 327.263672 352.162109 C 326.876312 351.655945 326.047546 350.93457 325.152344 350.224609 L 356.195313 373.066406 L 356.195313 466.650391 L 332.341797 484.783203 L 325.341797 489.962891 Z M 325.152344 350.224609 L 321.849609 347.794922 C 321.849609 347.794922 323.600769 348.994141 325.152344 350.224609 Z M 357.035156 361.496094 L 331.798828 342.400391 L 331.798828 254.214844 C 331.798828 254.214844 331.80127 248.152374 331.798828 245.121094 C 331.796112 241.782318 331.699066 238.738068 330.232422 236.890625 C 327.931671 233.992523 324.644531 232 324.644531 232 L 357.035156 249.087891 L 357.035156 361.496094 Z"
                    />
                </g>
                <g id="Group-copy-4">
                    <linearGradient
                        id="linearGradient7"
                        x1="486.404138"
                        y1="405.305952"
                        x2="455.747941"
                        y2="371.987093"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1c438b" stopOpacity="1" />
                        <stop offset="1" stopColor="#53b6f9" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path6"
                        fill="url(#linearGradient7)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 459.819397 318.592743 L 459.819397 414.493805 L 485.056519 398.674072 L 485.056519 335.653687 Z"
                    />
                    <linearGradient
                        id="linearGradient8"
                        x1="416.764324"
                        y1="409.618151"
                        x2="448.673395"
                        y2="401.74393"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1c438b" stopOpacity="1" />
                        <stop offset="1" stopColor="#53b6f9" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path7"
                        fill="url(#linearGradient8)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 459.635071 407.899139 L 419.92984 384.372131 L 399.25531 398.894348 L 444.057434 427.754883 Z"
                    />
                    <linearGradient
                        id="linearGradient9"
                        x1="377.829952"
                        y1="433.502583"
                        x2="446.708072"
                        y2="433.502583"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#53b6f9" stopOpacity="1" />
                        <stop offset="1" stopColor="#1c438b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path8"
                        fill="url(#linearGradient9)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 394.480469 489.603516 L 377.130859 469.876953 L 384.28125 466.175781 L 434.582031 434.074219 L 434.582031 393.015625 L 459.820313 377.478516 L 459.820313 390.251953 L 459.820313 447.302734 L 459.511719 447.302734 L 459.865234 447.875 L 394.480469 489.603516 Z"
                    />
                    <linearGradient
                        id="linearGradient10"
                        x1="373.939965"
                        y1="296.907929"
                        x2="430.528386"
                        y2="365.499651"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#53b6f9" stopOpacity="1" />
                        <stop offset="1" stopColor="#1c438b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path9"
                        fill="url(#linearGradient10)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 378.734375 393.533203 L 363.746094 373.230469 L 428.693359 325.283203 L 428.693359 290.757813 L 453.931641 268.958984 L 453.931641 337.105469 L 454.369141 337.697266 L 378.734375 393.533203 Z"
                    />
                    <linearGradient
                        id="linearGradient11"
                        x1="382.374743"
                        y1="256.466635"
                        x2="446.819836"
                        y2="256.466635"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#53b6f9" stopOpacity="1" />
                        <stop offset="1" stopColor="#1c438b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path10"
                        fill="url(#linearGradient11)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 446.819824 261.815094 L 395.811371 232.038879 L 383.069061 238.63681 L 382.374756 253.401703 L 424.553894 280.894409 Z"
                    />
                    <linearGradient
                        id="linearGradient12"
                        x1="391.992895"
                        y1="425.914436"
                        x2="392.667947"
                        y2="360.892473"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#3478f6" stopOpacity="1" />
                        <stop offset="1" stopColor="#53b6f9" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path11"
                        fill="url(#linearGradient12)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 394.771484 489.962891 L 387.771484 484.783203 L 363.917969 466.650391 L 363.917969 373.066406 L 394.960938 350.224609 C 394.065735 350.93457 393.236969 351.655945 392.849609 352.162109 C 390.092316 355.765015 389.166962 361.726807 389.181641 366.658203 C 389.203217 373.902283 389.15625 378.574219 389.15625 378.574219 L 389.15625 473.324219 C 389.15625 473.324219 389.219971 473.619385 389.181641 477.039063 C 389.171753 477.921906 390.398254 484.62146 392.150391 486.644531 C 394.321747 489.151733 394.771484 489.962891 394.771484 489.962891 Z M 394.960938 350.224609 C 396.512512 348.994141 398.263672 347.794922 398.263672 347.794922 L 394.960938 350.224609 Z M 363.076172 361.496094 L 363.076172 249.087891 L 395.46875 232 C 395.46875 232 392.18161 233.992523 389.880859 236.890625 C 388.414215 238.738068 388.317169 241.782318 388.314453 245.121094 C 388.312012 248.152374 388.314453 254.214844 388.314453 254.214844 L 388.314453 342.400391 L 363.076172 361.496094 Z"
                    />
                </g>
            </g>
            <g id="Group-copy">
                <g id="g1">
                    <linearGradient
                        id="linearGradient13"
                        x1="261.646853"
                        y1="404.342449"
                        x2="230.984199"
                        y2="371.016574"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1f2022" stopOpacity="1" />
                        <stop offset="1" stopColor="#ced4da" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path12"
                        fill="url(#linearGradient13)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 260.29895 317.610992 L 260.29895 413.532227 L 235.056519 397.709167 L 235.056519 334.675507 Z"
                    />
                    <linearGradient
                        id="linearGradient14"
                        x1="277.996037"
                        y1="408.655557"
                        x2="309.911827"
                        y2="400.779678"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1f2022" stopOpacity="1" />
                        <stop offset="1" stopColor="#ced4da" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path13"
                        fill="url(#linearGradient14)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 260.483307 406.936188 L 300.196899 383.404205 L 320.875824 397.929504 L 276.06424 426.796112 Z"
                    />
                    <linearGradient
                        id="linearGradient15"
                        x1="260.951734"
                        y1="432.545019"
                        x2="329.844361"
                        y2="432.545019"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#ced4da" stopOpacity="1" />
                        <stop offset="1" stopColor="#1f2022" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path14"
                        fill="url(#linearGradient15)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 325.652344 488.65625 L 260.251953 446.919922 L 260.607422 446.347656 L 260.298828 446.347656 L 260.298828 389.285156 L 260.298828 376.509766 L 285.541016 392.050781 L 285.541016 433.117188 L 335.853516 465.224609 L 343.003906 468.927734 L 325.652344 488.65625 Z"
                    />
                    <linearGradient
                        id="linearGradient16"
                        x1="275.946515"
                        y1="295.921599"
                        x2="332.546854"
                        y2="364.527765"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#ced4da" stopOpacity="1" />
                        <stop offset="1" stopColor="#1f2022" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path15"
                        fill="url(#linearGradient16)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 341.400391 392.568359 L 265.75 336.71875 L 266.189453 336.123047 L 266.189453 267.966797 L 291.431641 289.769531 L 291.431641 324.300781 L 356.392578 372.259766 L 341.400391 392.568359 Z"
                    />
                    <linearGradient
                        id="linearGradient17"
                        x1="273.301254"
                        y1="255.471787"
                        x2="337.759919"
                        y2="255.471787"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#dee2e6" stopOpacity="1" />
                        <stop offset="1" stopColor="#1f2022" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path16"
                        fill="url(#linearGradient17)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 273.301239 260.821381 L 324.320465 231.038879 L 337.06546 237.638214 L 337.759918 252.406219 L 295.571869 279.904694 Z"
                    />
                    <linearGradient
                        id="linearGradient18"
                        x1="350.789296"
                        y1="424.955274"
                        x2="351.464491"
                        y2="359.919618"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#202428" stopOpacity="1" />
                        <stop offset="1" stopColor="#ced4da" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path17"
                        fill="url(#linearGradient18)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 325.361328 489.017578 C 325.361328 489.017578 325.810608 488.204987 327.982422 485.697266 C 329.734924 483.673767 330.96109 476.97287 330.951172 476.089844 C 330.912842 472.669434 330.978516 472.375 330.978516 472.375 L 330.978516 377.605469 C 330.978516 377.605469 330.929596 372.931122 330.951172 365.685547 C 330.965881 360.753082 330.041077 354.791168 327.283203 351.1875 C 326.891479 350.675659 326.047333 349.944244 325.140625 349.226563 L 356.220703 372.095703 L 356.220703 465.699219 L 332.363281 483.835938 L 325.361328 489.017578 Z M 325.140625 349.226563 L 321.867188 346.818359 C 321.867188 346.818359 323.596161 348.00412 325.140625 349.226563 Z M 357.0625 360.523438 L 331.818359 341.421875 L 331.818359 253.220703 C 331.818359 253.220703 331.820831 247.156952 331.818359 244.125 C 331.815674 240.785553 331.718933 237.738464 330.251953 235.890625 C 327.950745 232.991913 324.662109 231 324.662109 231 L 357.0625 248.091797 L 357.0625 360.523438 Z"
                    />
                </g>
                <g id="Group-copy-5">
                    <linearGradient
                        id="linearGradient19"
                        x1="486.404422"
                        y1="404.342449"
                        x2="455.741768"
                        y2="371.016574"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1f2022" stopOpacity="1" />
                        <stop offset="1" stopColor="#ced4da" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path18"
                        fill="url(#linearGradient19)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 459.814087 317.610992 L 459.814087 413.532227 L 485.056519 397.709167 L 485.056519 334.675507 Z"
                    />
                    <linearGradient
                        id="linearGradient20"
                        x1="416.749942"
                        y1="408.655557"
                        x2="448.665733"
                        y2="400.779678"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1f2022" stopOpacity="1" />
                        <stop offset="1" stopColor="#ced4da" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path19"
                        fill="url(#linearGradient20)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 459.62973 406.936188 L 419.916138 383.404205 L 399.237213 397.929504 L 444.048798 426.796112 Z"
                    />
                    <linearGradient
                        id="linearGradient21"
                        x1="377.80737"
                        y1="432.545019"
                        x2="446.699996"
                        y2="432.545019"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#ced4da" stopOpacity="1" />
                        <stop offset="1" stopColor="#1f2022" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path20"
                        fill="url(#linearGradient21)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 394.460938 488.65625 L 377.107422 468.927734 L 384.259766 465.224609 L 434.572266 433.115234 L 434.572266 392.050781 L 459.814453 376.509766 L 459.814453 389.285156 L 459.814453 446.347656 L 459.505859 446.347656 L 459.861328 446.919922 L 394.460938 488.65625 Z"
                    />
                    <linearGradient
                        id="linearGradient22"
                        x1="373.916564"
                        y1="295.921599"
                        x2="430.516903"
                        y2="364.527765"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#ced4da" stopOpacity="1" />
                        <stop offset="1" stopColor="#1f2022" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path21"
                        fill="url(#linearGradient22)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 378.710938 392.568359 L 363.71875 372.259766 L 428.681641 324.300781 L 428.681641 289.769531 L 453.923828 267.966797 L 453.923828 336.123047 L 454.363281 336.71875 L 378.710938 392.568359 Z"
                    />
                    <linearGradient
                        id="linearGradient23"
                        x1="382.353119"
                        y1="255.471787"
                        x2="446.811783"
                        y2="255.471787"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#dee2e6" stopOpacity="1" />
                        <stop offset="1" stopColor="#1f2022" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path22"
                        fill="url(#linearGradient23)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 446.811798 260.821381 L 395.792572 231.038879 L 383.047577 237.638214 L 382.353119 252.406219 L 424.541168 279.904694 Z"
                    />
                    <linearGradient
                        id="linearGradient24"
                        x1="391.973296"
                        y1="424.955274"
                        x2="392.648491"
                        y2="359.919618"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#202428" stopOpacity="1" />
                        <stop offset="1" stopColor="#ced4da" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path23"
                        fill="url(#linearGradient24)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 394.751953 489.017578 L 387.75 483.835938 L 363.892578 465.699219 L 363.892578 372.095703 L 394.970703 349.228516 C 394.064758 349.945679 393.221497 350.676056 392.830078 351.1875 C 390.072205 354.791168 389.1474 360.753082 389.162109 365.685547 C 389.183685 372.931122 389.134766 377.605469 389.134766 377.605469 L 389.134766 472.375 C 389.134766 472.375 389.200439 472.669434 389.162109 476.089844 C 389.152191 476.97287 390.378357 483.673767 392.130859 485.697266 C 394.302673 488.204987 394.751953 489.017578 394.751953 489.017578 Z M 394.970703 349.228516 C 396.515686 348.005493 398.246094 346.818359 398.246094 346.818359 L 394.970703 349.228516 Z M 363.050781 360.523438 L 363.050781 248.091797 L 395.451172 231 C 395.451172 231 392.162537 232.991913 389.861328 235.890625 C 388.394348 237.738464 388.295654 240.785553 388.292969 244.125 C 388.290497 247.156952 388.292969 253.220703 388.292969 253.220703 L 388.292969 341.421875 L 363.050781 360.523438 Z"
                    />
                </g>
            </g>
            <g id="g2">
                <g id="g3">
                    <linearGradient
                        id="linearGradient25"
                        x1="271.63918"
                        y1="411.199174"
                        x2="240.814647"
                        y2="369.234297"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#7d7d7d" stopOpacity="1" />
                        <stop offset="1" stopColor="#2b2b2b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path24"
                        fill="url(#linearGradient25)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 260.29068 318.582581 L 260.29068 414.472382 L 235.056519 398.65451 L 235.056519 335.64151 Z"
                    />
                    <linearGradient
                        id="linearGradient26"
                        x1="271.539831"
                        y1="420.62369"
                        x2="310.458703"
                        y2="396.674285"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#7d7d7d" stopOpacity="1" />
                        <stop offset="1" stopColor="#2b2b2b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path25"
                        fill="url(#linearGradient26)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 260.474976 407.878479 L 300.175568 384.354218 L 320.847656 398.874756 L 276.050781 427.731903 Z"
                    />
                    <linearGradient
                        id="linearGradient27"
                        x1="340.881839"
                        y1="474.360219"
                        x2="274.800879"
                        y2="438.674715"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#7d7d7d" stopOpacity="1" />
                        <stop offset="1" stopColor="#2b2b2b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path26"
                        fill="url(#linearGradient27)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 325.623047 489.572266 L 260.244141 447.849609 L 260.599609 447.277344 L 260.291016 447.277344 L 260.291016 390.232422 L 260.291016 377.462891 L 285.525391 392.998047 L 285.525391 434.050781 L 335.820313 466.148438 L 342.96875 469.849609 L 325.623047 489.572266 Z"
                    />
                    <linearGradient
                        id="linearGradient28"
                        x1="339.345853"
                        y1="376.167471"
                        x2="289.434035"
                        y2="344.273178"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#7d7d7d" stopOpacity="1" />
                        <stop offset="1" stopColor="#2b2b2b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path27"
                        fill="url(#linearGradient28)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 341.367188 393.513672 L 265.740234 337.683594 L 266.177734 337.091797 L 266.177734 268.955078 L 291.412109 290.75 L 291.412109 325.271484 L 356.353516 373.212891 L 341.367188 393.513672 Z"
                    />
                    <linearGradient
                        id="linearGradient29"
                        x1="298.760411"
                        y1="273.940002"
                        x2="341.580322"
                        y2="242.967812"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#2b2b2b" stopOpacity="1" />
                        <stop offset="1" stopColor="#7d7d7d" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path28"
                        fill="url(#linearGradient29)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 273.288727 261.811615 L 324.291168 232.038849 L 337.031982 238.636047 L 337.726227 253.3992 L 295.552032 280.888672 Z"
                    />
                    <linearGradient
                        id="linearGradient30"
                        x1="350.751347"
                        y1="425.891676"
                        x2="348.231535"
                        y2="326.485562"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1e1c1c" stopOpacity="1" />
                        <stop offset="1" stopColor="#3d3c3c" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path29"
                        fill="url(#linearGradient30)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 325.332031 489.931641 C 325.332031 489.931641 325.78006 489.120178 327.951172 486.613281 C 329.703094 484.590454 330.92981 477.892517 330.919922 477.009766 C 330.881592 473.590485 330.947266 473.294922 330.947266 473.294922 L 330.947266 378.556641 C 330.947266 378.556641 330.898346 373.88385 330.919922 366.640625 C 330.934601 361.709808 330.008911 355.748962 327.251953 352.146484 C 326.861786 351.636658 326.023743 350.910248 325.121094 350.195313 L 356.179688 373.050781 L 356.179688 466.623047 L 332.330078 484.751953 L 325.332031 489.931641 Z M 325.121094 350.195313 L 321.839844 347.78125 C 321.839844 347.78125 323.574646 348.97049 325.121094 350.195313 Z M 357.021484 361.480469 L 331.787109 342.386719 L 331.787109 254.212891 C 331.787109 254.212891 331.789551 248.152039 331.787109 245.121094 C 331.784393 241.782715 331.687195 238.737854 330.220703 236.890625 C 327.920227 233.992889 324.632813 232 324.632813 232 L 357.021484 249.085938 L 357.021484 361.480469 Z"
                    />
                </g>
                <g id="g4">
                    <linearGradient
                        id="linearGradient31"
                        x1="496.405026"
                        y1="411.199174"
                        x2="465.580493"
                        y2="369.234297"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#7d7d7d" stopOpacity="1" />
                        <stop offset="1" stopColor="#2b2b2b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path30"
                        fill="url(#linearGradient31)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 459.822357 318.582581 L 459.822357 414.472382 L 485.056519 398.65451 L 485.056519 335.64151 Z"
                    />
                    <linearGradient
                        id="linearGradient32"
                        x1="410.330214"
                        y1="420.62369"
                        x2="449.249087"
                        y2="396.674285"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#7d7d7d" stopOpacity="1" />
                        <stop offset="1" stopColor="#2b2b2b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path31"
                        fill="url(#linearGradient32)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 459.638062 407.878479 L 419.937469 384.354218 L 399.265381 398.874756 L 444.062256 427.731903 Z"
                    />
                    <linearGradient
                        id="linearGradient33"
                        x1="457.781133"
                        y1="474.360219"
                        x2="391.700173"
                        y2="438.674715"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#7d7d7d" stopOpacity="1" />
                        <stop offset="1" stopColor="#2b2b2b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path32"
                        fill="url(#linearGradient33)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 394.490234 489.572266 L 377.142578 469.849609 L 384.292969 466.148438 L 434.587891 434.050781 L 434.587891 392.998047 L 459.822266 377.462891 L 459.822266 390.232422 L 459.822266 447.277344 L 459.513672 447.277344 L 459.869141 447.849609 L 394.490234 489.572266 Z"
                    />
                    <linearGradient
                        id="linearGradient34"
                        x1="437.365753"
                        y1="376.167471"
                        x2="387.453935"
                        y2="344.273178"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#7d7d7d" stopOpacity="1" />
                        <stop offset="1" stopColor="#2b2b2b" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path33"
                        fill="url(#linearGradient34)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 378.746094 393.513672 L 363.759766 373.212891 L 428.701172 325.271484 L 428.701172 290.75 L 453.933594 268.955078 L 453.933594 337.087891 L 454.373047 337.683594 L 378.746094 393.513672 Z"
                    />
                    <linearGradient
                        id="linearGradient35"
                        x1="407.858493"
                        y1="273.940002"
                        x2="450.678404"
                        y2="242.967812"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#2b2b2b" stopOpacity="1" />
                        <stop offset="1" stopColor="#7d7d7d" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path34"
                        fill="url(#linearGradient35)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 446.82431 261.811615 L 395.821869 232.038849 L 383.081055 238.636047 L 382.38681 253.3992 L 424.561005 280.888672 Z"
                    />
                    <linearGradient
                        id="linearGradient36"
                        x1="392.003818"
                        y1="425.891676"
                        x2="389.484006"
                        y2="326.485562"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#1e1c1c" stopOpacity="1" />
                        <stop offset="1" stopColor="#3d3c3c" stopOpacity="1" />
                    </linearGradient>
                    <path
                        id="path35"
                        fill="url(#linearGradient36)"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 394.78125 489.931641 L 387.78125 484.751953 L 363.931641 466.623047 L 363.931641 373.050781 L 394.994141 350.195313 C 394.091034 350.910553 393.251678 351.636444 392.861328 352.146484 C 390.10437 355.748962 389.17868 361.709808 389.193359 366.640625 C 389.214935 373.88385 389.166016 378.556641 389.166016 378.556641 L 389.166016 473.294922 C 389.166016 473.294922 389.231689 473.590485 389.193359 477.009766 C 389.183472 477.892517 390.410187 484.590454 392.162109 486.613281 C 394.333221 489.120178 394.78125 489.931641 394.78125 489.931641 Z M 394.994141 350.195313 C 396.540283 348.970825 398.273438 347.78125 398.273438 347.78125 L 394.994141 350.195313 Z M 363.091797 361.480469 L 363.091797 249.085938 L 395.480469 232 C 395.480469 232 392.193054 233.992889 389.892578 236.890625 C 388.426086 238.737854 388.328888 241.782715 388.326172 245.121094 C 388.32373 248.152039 388.326172 254.212891 388.326172 254.212891 L 388.326172 342.386719 L 363.091797 361.480469 Z"
                    />
                </g>
            </g>
            <g id="g5">
                <g id="g6">
                    <path
                        id="path36"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 260.29895 317.610992 L 260.29895 413.532227 L 235.056519 397.709167 L 235.056519 334.675507 Z"
                    />
                    <path
                        id="path37"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 260.483307 406.936188 L 300.196899 383.404205 L 320.875824 397.929504 L 276.06424 426.796112 Z"
                    />
                    <path
                        id="path38"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 325.652344 488.65625 L 260.251953 446.919922 L 260.607422 446.347656 L 260.298828 446.347656 L 260.298828 389.285156 L 260.298828 376.509766 L 285.541016 392.050781 L 285.541016 433.117188 L 335.853516 465.224609 L 343.003906 468.927734 L 325.652344 488.65625 Z"
                    />
                    <path
                        id="path39"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 341.400391 392.568359 L 265.75 336.71875 L 266.189453 336.123047 L 266.189453 267.966797 L 291.431641 289.769531 L 291.431641 324.300781 L 356.392578 372.259766 L 341.400391 392.568359 Z"
                    />
                    <path
                        id="path40"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 273.301239 260.821381 L 324.320465 231.038879 L 337.06546 237.638214 L 337.759918 252.406219 L 295.571869 279.904694 Z"
                    />
                    <path
                        id="path41"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 325.361328 489.017578 C 325.361328 489.017578 325.810608 488.204987 327.982422 485.697266 C 329.734924 483.673767 330.96109 476.97287 330.951172 476.089844 C 330.912842 472.669434 330.978516 472.375 330.978516 472.375 L 330.978516 377.605469 C 330.978516 377.605469 330.929596 372.931122 330.951172 365.685547 C 330.965881 360.753082 330.041077 354.791168 327.283203 351.1875 C 326.891479 350.675659 326.047333 349.944244 325.140625 349.226563 L 356.220703 372.095703 L 356.220703 465.699219 L 332.363281 483.835938 L 325.361328 489.017578 Z M 325.140625 349.226563 L 321.867188 346.818359 C 321.867188 346.818359 323.596161 348.00412 325.140625 349.226563 Z M 357.0625 360.523438 L 331.818359 341.421875 L 331.818359 253.220703 C 331.818359 253.220703 331.820831 247.156952 331.818359 244.125 C 331.815674 240.785553 331.718933 237.738464 330.251953 235.890625 C 327.950745 232.991913 324.662109 231 324.662109 231 L 357.0625 248.091797 L 357.0625 360.523438 Z"
                    />
                </g>
                <g id="g7">
                    <path
                        id="path42"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 459.814087 317.610992 L 459.814087 413.532227 L 485.056519 397.709167 L 485.056519 334.675507 Z"
                    />
                    <path
                        id="path43"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 459.62973 406.936188 L 419.916138 383.404205 L 399.237213 397.929504 L 444.048798 426.796112 Z"
                    />
                    <path
                        id="path44"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 394.460938 488.65625 L 377.107422 468.927734 L 384.259766 465.224609 L 434.572266 433.115234 L 434.572266 392.050781 L 459.814453 376.509766 L 459.814453 389.285156 L 459.814453 446.347656 L 459.505859 446.347656 L 459.861328 446.919922 L 394.460938 488.65625 Z"
                    />
                    <path
                        id="path45"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 378.710938 392.568359 L 363.71875 372.259766 L 428.681641 324.300781 L 428.681641 289.769531 L 453.923828 267.966797 L 453.923828 336.123047 L 454.363281 336.71875 L 378.710938 392.568359 Z"
                    />
                    <path
                        id="path46"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 446.811798 260.821381 L 395.792572 231.038879 L 383.047577 237.638214 L 382.353119 252.406219 L 424.541168 279.904694 Z"
                    />
                    <path
                        id="path47"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        visibility="hidden"
                        d="M 394.751953 489.017578 L 387.75 483.835938 L 363.892578 465.699219 L 363.892578 372.095703 L 394.970703 349.228516 C 394.064758 349.945679 393.221497 350.676056 392.830078 351.1875 C 390.072205 354.791168 389.1474 360.753082 389.162109 365.685547 C 389.183685 372.931122 389.134766 377.605469 389.134766 377.605469 L 389.134766 472.375 C 389.134766 472.375 389.200439 472.669434 389.162109 476.089844 C 389.152191 476.97287 390.378357 483.673767 392.130859 485.697266 C 394.302673 488.204987 394.751953 489.017578 394.751953 489.017578 Z M 394.970703 349.228516 C 396.515686 348.005493 398.246094 346.818359 398.246094 346.818359 L 394.970703 349.228516 Z M 363.050781 360.523438 L 363.050781 248.091797 L 395.451172 231 C 395.451172 231 392.162537 232.991913 389.861328 235.890625 C 388.394348 237.738464 388.295654 240.785553 388.292969 244.125 C 388.290497 247.156952 388.292969 253.220703 388.292969 253.220703 L 388.292969 341.421875 L 363.050781 360.523438 Z"
                    />
                </g>
            </g>
            <g id="g8">
                <g id="g9">
                    <path
                        id="path48"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 95.876144 248.269257 L 95.876144 502.183838 L 29.056519 460.298401 L 29.056519 293.44104 Z"
                    />
                    <path
                        id="path49"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 96.364189 484.723328 L 201.490646 422.431488 L 256.230072 460.881622 L 137.608658 537.294861 Z"
                    />
                    <path
                        id="path50"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 268.875 701.048828 L 95.753906 590.566406 L 96.693359 589.048828 L 95.876953 589.048828 L 95.876953 437.998047 L 95.876953 404.181641 L 162.695313 445.318359 L 162.695313 554.027344 L 295.876953 639.021484 L 314.808594 648.820313 L 268.875 701.048828 Z"
                    />
                    <path
                        id="path51"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 310.5625 446.6875 L 110.304688 298.849609 L 111.466797 297.275391 L 111.466797 116.857422 L 178.287109 174.570313 L 178.287109 265.980469 L 350.25 392.929688 L 310.5625 446.6875 Z"
                    />
                    <path
                        id="path52"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 130.294739 97.940613 L 265.34845 19.102905 L 299.085907 36.572083 L 300.924255 75.664673 L 189.24765 148.45636 Z"
                    />
                    <path
                        id="path53"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 268.103516 702 C 268.103516 702 269.289978 699.853027 275.039063 693.214844 C 279.678101 687.858398 282.926575 670.118713 282.900391 667.78125 C 282.798889 658.727112 282.970703 657.945313 282.970703 657.945313 L 282.970703 407.082031 C 282.970703 407.082031 282.843262 394.709167 282.900391 375.529297 C 282.939301 362.472534 280.489868 346.687775 273.189453 337.148438 C 272.160736 335.80423 269.954681 333.88916 267.576172 332.003906 L 349.791016 392.498047 L 349.791016 640.277344 L 286.638672 688.285156 L 268.103516 702 Z M 267.576172 332.003906 L 258.855469 325.587891 C 258.855469 325.587891 263.473511 328.752045 267.576172 332.003906 Z M 352.017578 361.863281 L 285.199219 311.300781 L 285.199219 77.820313 C 285.199219 77.820313 285.205719 61.768005 285.199219 53.742188 C 285.192047 44.902222 284.934052 36.838745 281.050781 31.947266 C 274.959167 24.274109 266.253906 19 266.253906 19 L 352.017578 64.242188 L 352.017578 361.863281 Z"
                    />
                </g>
                <g id="g10">
                    <path
                        id="path54"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 624.015686 248.269257 L 624.015686 502.183838 L 690.835327 460.298401 L 690.835327 293.44104 Z"
                    />
                    <path
                        id="path55"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 623.527649 484.723328 L 518.401184 422.431488 L 463.661774 460.881622 L 582.283203 537.294861 Z"
                    />
                    <path
                        id="path56"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 451.017578 701.048828 L 405.083984 648.820313 L 424.013672 639.021484 L 557.195313 554.027344 L 557.195313 445.318359 L 624.015625 404.181641 L 624.015625 437.998047 L 624.015625 589.048828 L 623.199219 589.048828 L 624.138672 590.566406 L 451.017578 701.048828 Z"
                    />
                    <path
                        id="path57"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 409.328125 446.6875 L 369.642578 392.929688 L 541.605469 265.980469 L 541.605469 174.570313 L 608.423828 116.857422 L 608.423828 297.273438 L 609.587891 298.849609 L 409.328125 446.6875 Z"
                    />
                    <path
                        id="path58"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 589.597107 97.940613 L 454.543396 19.102905 L 420.805939 36.572083 L 418.96759 75.664673 L 530.644165 148.45636 Z"
                    />
                    <path
                        id="path59"
                        fill="#7d7d7d"
                        fillRule="evenodd"
                        stroke="none"
                        d="M 451.789063 702 L 433.253906 688.285156 L 370.101563 640.277344 L 370.101563 392.498047 L 452.294922 332.019531 C 449.924042 333.899689 447.72702 335.807983 446.701172 337.148438 C 439.400787 346.687775 436.951324 362.472534 436.990234 375.529297 C 437.047333 394.709167 436.919922 407.082031 436.919922 407.082031 L 436.919922 657.945313 C 436.919922 657.945313 437.091705 658.727112 436.990234 667.78125 C 436.96402 670.118713 440.212524 687.858398 444.851563 693.214844 C 450.600616 699.853027 451.789063 702 451.789063 702 Z M 452.294922 332.019531 C 456.402527 328.762146 461.037109 325.587891 461.037109 325.587891 L 452.294922 332.019531 Z M 367.873047 361.863281 L 367.873047 64.242188 L 453.638672 19 C 453.638672 19 444.931488 24.274109 438.839844 31.947266 C 434.956604 36.838745 434.700531 44.902222 434.693359 53.742188 C 434.686859 61.768005 434.693359 77.820313 434.693359 77.820313 L 434.693359 311.300781 L 367.873047 361.863281 Z"
                    />
                </g>
            </g>
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
