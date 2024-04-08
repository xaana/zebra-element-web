import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { v4 as uuid } from "uuid";

import { AiDataQueryView } from "./components/AiDataQueryView";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        aiDataQuery: {
            setAiDataQuery: () => ReturnType;
        };
    }
}

export const AiDataQuery = Node.create({
    name: "aiDataQuery",

    group: "block",

    draggable: true,

    addOptions() {
        return {
            prompt: "",
            database: undefined,
            HTMLAttributes: {
                class: `node-${this.name}`,
            },
        };
    },

    addAttributes() {
        return {
            id: {
                default: undefined,
                parseHTML: (element) => element.getAttribute("data-id"),
                renderHTML: (attributes) => ({
                    "data-id": attributes.id,
                }),
            },
            prompt: {
                default: "",
            },
            database: {
                default: undefined,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: `div.node-${this.name}`,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },

    addCommands() {
        return {
            setAiDataQuery:
                () =>
                ({ chain }) =>
                    chain()
                        .focus()
                        .insertContent({
                            type: this.name,
                            attrs: {
                                id: uuid(),
                                prompt: this.options.prompt,
                                database: this.options.database,
                            },
                        })
                        .run(),
        };
    },

    addNodeView() {
        // eslint-disable-next-line new-cap
        return ReactNodeViewRenderer(AiDataQueryView);
    },
});

export default AiDataQuery;
