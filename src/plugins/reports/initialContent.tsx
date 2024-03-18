import type { Template, File } from "@/plugins/reports/types";

export const initialContent = {
    type: "doc",
    content: [
        {
            type: "heading",
            attrs: {
                textAlign: "left",
                level: 1,
            },
            content: [
                {
                    type: "text",
                    text: "Zebra Reports Generator",
                },
            ],
        },
        {
            type: "paragraph",
            attrs: {
                class: null,
                textAlign: "left",
            },
            content: [
                {
                    type: "text",
                    text: "Welcome to our reports editor template.",
                },
            ],
        },
        {
            type: "paragraph",
            attrs: {
                class: null,
                textAlign: "left",
            },
            content: [
                {
                    type: "text",
                    text: "This editor includes features like:",
                },
            ],
        },
        {
            type: "bulletList",
            content: [
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            attrs: {
                                class: null,
                                textAlign: "left",
                            },
                            content: [
                                {
                                    type: "text",
                                    text: "A DragHandle including a DragHandle menu",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            attrs: {
                                class: null,
                                textAlign: "left",
                            },
                            content: [
                                {
                                    type: "text",
                                    text: "A Slash menu that can be triggered via typing a ",
                                },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "code",
                                        },
                                    ],
                                    text: "/",
                                },
                                {
                                    type: "text",
                                    text: " into an empty paragraph or by using the ",
                                },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "bold",
                                        },
                                    ],
                                    text: "+ Button",
                                },
                                {
                                    type: "text",
                                    text: " next to the drag handle",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            attrs: {
                                class: null,
                                textAlign: "left",
                            },
                            content: [
                                {
                                    type: "text",
                                    text: "A TextFormatting menu that allows you to change the ",
                                },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "textStyle",
                                            attrs: {
                                                fontSize: "18px",
                                                fontFamily: null,
                                                color: null,
                                            },
                                        },
                                    ],
                                    text: "font size",
                                },
                                {
                                    type: "text",
                                    text: ", ",
                                },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "bold",
                                        },
                                    ],
                                    text: "font weight",
                                },
                                {
                                    type: "text",
                                    text: ", ",
                                },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "textStyle",
                                            attrs: {
                                                fontSize: null,
                                                fontFamily: "Georgia",
                                                color: null,
                                            },
                                        },
                                    ],
                                    text: "font family",
                                },
                                {
                                    type: "text",
                                    text: ", ",
                                },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "textStyle",
                                            attrs: {
                                                fontSize: null,
                                                fontFamily: null,
                                                color: "#b91c1c",
                                            },
                                        },
                                    ],
                                    text: "color",
                                },
                                {
                                    type: "text",
                                    text: ", ",
                                },
                                {
                                    type: "text",
                                    marks: [
                                        {
                                            type: "highlight",
                                            attrs: {
                                                color: "#7e7922",
                                            },
                                        },
                                    ],
                                    text: "highlight",
                                },
                                {
                                    type: "text",
                                    text: " and more",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            attrs: {
                                class: null,
                                textAlign: "left",
                            },
                            content: [
                                {
                                    type: "text",
                                    text: "A Table of Contents that can be viewed via clicking on the button on the top left corner",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            attrs: {
                                class: null,
                                textAlign: "left",
                            },
                            content: [
                                {
                                    type: "text",
                                    text: "AI implementation with text generation using Zebra LLM",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: "imageBlock",
            attrs: {
                src: "/img/placeholder-image.jpg",
                width: "100%",
                align: "center",
            },
        },
        {
            type: "paragraph",
            attrs: {
                class: null,
                textAlign: "left",
            },
        },
    ],
};

export const sampleTemplate = {
    name: "Financial Report",
    description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hicconsequatur ab animi sunt sed voluptas corporis et ad at saepe.",
    id: "0",
    createdAt: new Date(),
    content: {
        type: "doc",
        content: [
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 1,
                },
                content: [
                    {
                        type: "text",
                        text: "Financial Report [Year]",
                    },
                ],
            },
            {
                type: "paragraph",
                attrs: {
                    class: null,
                    textAlign: "left",
                },
                content: [
                    {
                        type: "text",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                    },
                ],
            },
            {
                type: "paragraph",
                attrs: {
                    class: null,
                    textAlign: "left",
                },
                content: [
                    {
                        type: "text",
                        marks: [
                            {
                                type: "bold",
                            },
                        ],
                        text: "Lorem ipsum:",
                    },
                ],
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        text: "sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        text: "change the ",
                                    },
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "textStyle",
                                                attrs: {
                                                    fontSize: "18px",
                                                    fontFamily: null,
                                                    color: null,
                                                },
                                            },
                                        ],
                                        text: "font size",
                                    },
                                    {
                                        type: "text",
                                        text: ", ",
                                    },
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "font weight",
                                    },
                                    {
                                        type: "text",
                                        text: ", ",
                                    },
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "textStyle",
                                                attrs: {
                                                    fontSize: null,
                                                    fontFamily: "Georgia",
                                                    color: null,
                                                },
                                            },
                                        ],
                                        text: "font family",
                                    },
                                    {
                                        type: "text",
                                        text: ", ",
                                    },
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "textStyle",
                                                attrs: {
                                                    fontSize: null,
                                                    fontFamily: null,
                                                    color: "#b91c1c",
                                                },
                                            },
                                        ],
                                        text: "color",
                                    },
                                    {
                                        type: "text",
                                        text: ", ",
                                    },
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "highlight",
                                                attrs: {
                                                    color: "#7e7922",
                                                },
                                            },
                                        ],
                                        text: "highlight",
                                    },
                                    {
                                        type: "text",
                                        text: " and more",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        text: "consectetur adipiscing elit, sed do eiusmod",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "imageBlock",
                attrs: {
                    src: "/img/placeholder-image.jpg",
                    width: "100%",
                    align: "center",
                },
            },
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 2,
                },
                content: [
                    {
                        type: "text",
                        text: "Ullamco Laboris",
                    },
                ],
            },
            {
                type: "paragraph",
                attrs: {
                    class: null,
                    textAlign: "left",
                },
                content: [
                    {
                        type: "text",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                    },
                ],
            },
            {
                type: "paragraph",
                attrs: {
                    class: null,
                    textAlign: "left",
                },
            },
        ],
    },
};

const logTemplate = {
    name: "Log   Report",
    description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hicconsequatur ab animi sunt sed voluptas corporis et ad at saepe.",
    id: "1",
    createdAt: new Date(),
    content: {
        type: "doc",
        content: [
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 1,
                },
                content: [
                    {
                        type: "text",
                        text: "Log Review Summary",
                    },
                ],
            },
            {
                type: "table",
                content: [
                    {
                        type: "tableRow",
                        content: [
                            {
                                type: "tableCell",
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [148],
                                    style: null,
                                },
                                content: [
                                    {
                                        type: "paragraph",
                                        attrs: {
                                            class: null,
                                            textAlign: "left",
                                        },
                                        content: [
                                            {
                                                type: "text",
                                                marks: [
                                                    {
                                                        type: "bold",
                                                    },
                                                ],
                                                text: "Review Date",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: "tableCell",
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: null,
                                    style: null,
                                },
                                content: [
                                    {
                                        type: "paragraph",
                                        attrs: {
                                            class: null,
                                            textAlign: "left",
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "tableRow",
                        content: [
                            {
                                type: "tableCell",
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [148],
                                    style: null,
                                },
                                content: [
                                    {
                                        type: "paragraph",
                                        attrs: {
                                            class: null,
                                            textAlign: "left",
                                        },
                                        content: [
                                            {
                                                type: "text",
                                                marks: [
                                                    {
                                                        type: "bold",
                                                    },
                                                ],
                                                text: "Reviewer(s)",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: "tableCell",
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: null,
                                    style: null,
                                },
                                content: [
                                    {
                                        type: "paragraph",
                                        attrs: {
                                            class: null,
                                            textAlign: "left",
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "tableRow",
                        content: [
                            {
                                type: "tableCell",
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [148],
                                    style: null,
                                },
                                content: [
                                    {
                                        type: "paragraph",
                                        attrs: {
                                            class: null,
                                            textAlign: "left",
                                        },
                                        content: [
                                            {
                                                type: "text",
                                                marks: [
                                                    {
                                                        type: "bold",
                                                    },
                                                ],
                                                text: "Period Covered",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: "tableCell",
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: null,
                                    style: null,
                                },
                                content: [
                                    {
                                        type: "paragraph",
                                        attrs: {
                                            class: null,
                                            textAlign: "left",
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "tableRow",
                        content: [
                            {
                                type: "tableCell",
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: [148],
                                    style: null,
                                },
                                content: [
                                    {
                                        type: "paragraph",
                                        attrs: {
                                            class: null,
                                            textAlign: "left",
                                        },
                                        content: [
                                            {
                                                type: "text",
                                                marks: [
                                                    {
                                                        type: "bold",
                                                    },
                                                ],
                                                text: "System/Component",
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: "tableCell",
                                attrs: {
                                    colspan: 1,
                                    rowspan: 1,
                                    colwidth: null,
                                    style: null,
                                },
                                content: [
                                    {
                                        type: "paragraph",
                                        attrs: {
                                            class: null,
                                            textAlign: "left",
                                        },
                                        content: [
                                            {
                                                type: "text",
                                                text: "Teradata Database",
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 2,
                },
                content: [
                    {
                        type: "text",
                        text: "Overview",
                    },
                ],
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "Purpose of Review: ",
                                    },
                                    {
                                        type: "text",
                                        text: "(E.g., Performance optimization, error diagnosis, security audit)",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "Key Log Sources Reviewed:",
                                    },
                                ],
                            },
                            {
                                type: "bulletList",
                                content: [
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "DBQL (Database Query Log)",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "System Event Logs",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Access Log",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Error Log",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 3,
                },
                content: [
                    {
                        type: "text",
                        text: "Key Insights",
                    },
                ],
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "Performance Insights:",
                                    },
                                ],
                            },
                            {
                                type: "bulletList",
                                content: [
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "High-impact queries (long duration, high CPU usage)",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Skewness in resource utilization across AMPs",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Frequent spool space issues or disk space warnings",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "aiWriter",
                attrs: {
                    authorName: "Zebra",
                    prompt: "Write in brief some insights about the log",
                },
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "Errors and Anomalies:",
                                    },
                                ],
                            },
                            {
                                type: "bulletList",
                                content: [
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Critical errors from the error log",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Unusual system events or restarts",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Failed login attempts or unusual access patterns",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "aiWriter",
                attrs: {
                    authorName: "Zebra",
                    prompt: "Write in brief some insights about errors if any in the log",
                },
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "Security Concerns:",
                                    },
                                ],
                            },
                            {
                                type: "bulletList",
                                content: [
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Unauthorized access attempts",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Deviations in normal access patterns",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: "listItem",
                                        content: [
                                            {
                                                type: "paragraph",
                                                attrs: {
                                                    class: null,
                                                    textAlign: "left",
                                                },
                                                content: [
                                                    {
                                                        type: "text",
                                                        text: "Changes in permissions or roles without approval",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 2,
                },
                content: [
                    {
                        type: "text",
                        text: "Action Items",
                    },
                ],
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "For Immediate Attention:",
                                    },
                                    {
                                        type: "hardBreak",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "aiWriter",
                attrs: {
                    authorName: "Zebra",
                    prompt: "Write some immediate attention action items, if required based on the log (E.g., Investigate unauthorized access attempts, resolve disk space issues)",
                },
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "For Long-Term Improvement:",
                                    },
                                    {
                                        type: "hardBreak",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "aiWriter",
                attrs: {
                    authorName: "Zebra",
                    prompt: "Write some long term action items, if required based on the log (E.g., Query optimization, review of security policies, hardware upgrades)",
                },
            },
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 2,
                },
                content: [
                    {
                        type: "text",
                        text: "Recommendations",
                    },
                ],
            },
            {
                type: "paragraph",
                attrs: {
                    class: null,
                    textAlign: "left",
                },
                content: [
                    {
                        type: "text",
                        text: "Brief suggestions for improving performance, security, and stability based on the review findings.",
                    },
                ],
            },
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 2,
                },
                content: [
                    {
                        type: "text",
                        text: "Next Steps",
                    },
                ],
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        text: "Specific follow-up actions, responsible individuals, and proposed timelines.",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 2,
                },
                content: [
                    {
                        type: "text",
                        text: "Next Review Schedule",
                    },
                ],
            },
            {
                type: "bulletList",
                content: [
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "Date:",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "listItem",
                        content: [
                            {
                                type: "paragraph",
                                attrs: {
                                    class: null,
                                    textAlign: "left",
                                },
                                content: [
                                    {
                                        type: "text",
                                        marks: [
                                            {
                                                type: "bold",
                                            },
                                        ],
                                        text: "Focus Areas:",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: "heading",
                attrs: {
                    textAlign: "left",
                    level: 3,
                },
                content: [
                    {
                        type: "text",
                        marks: [
                            {
                                type: "bold",
                            },
                        ],
                        text: "Notes",
                    },
                ],
            },
            {
                type: "aiWriter",
                attrs: {
                    authorName: "Zebra",
                    prompt: "Include any special observations, external factors affecting the system, or considerations for future reviews based on the log",
                },
            },
            {
                type: "paragraph",
                attrs: {
                    class: null,
                    textAlign: "left",
                },
            },
        ],
    },
};

export const templatesData: Template[] = [sampleTemplate, logTemplate];

export const filesData: File[] = [
    {
        id: "a",
        name: "Invoice.pdf",
        owner: "zebra_admin",
        createdAt: new Date(),
    },
    {
        id: "b",
        name: "Defence Strategic Review.pdf",
        owner: "zebra_admin",
        createdAt: new Date(),
    },
    {
        id: "c",
        name: "Report.pdf",
        owner: "zebra_admin",
        createdAt: new Date(),
    },
];
