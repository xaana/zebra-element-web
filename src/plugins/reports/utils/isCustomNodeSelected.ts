import { Editor } from "@tiptap/react";

import {
    AiWriter,
    Figcaption,
    HorizontalRule,
    ImageBlock,
    ImageUpload,
    Link,
    CodeBlock,
} from "@/plugins/reports/extensions";
import { TableOfContentsNode } from "@/plugins/reports/extensions/TableOfContentsNode";

export const isTableGripSelected = (node: HTMLElement): boolean => {
    let container = node;

    while (container && !["TD", "TH"].includes(container.tagName)) {
        container = container.parentElement!;
    }

    const gripColumn = container && container.querySelector && container.querySelector("a.grip-column.selected");
    const gripRow = container && container.querySelector && container.querySelector("a.grip-row.selected");

    if (gripColumn || gripRow) {
        return true;
    }

    return false;
};

export const isCustomNodeSelected = (editor: Editor, node: HTMLElement): boolean => {
    const customNodes = [
        HorizontalRule.name,
        ImageBlock.name,
        ImageUpload.name,
        CodeBlock.name,
        ImageBlock.name,
        Link.name,
        AiWriter.name,
        Figcaption.name,
        TableOfContentsNode.name,
    ];

    return customNodes.some((type) => editor.isActive(type)) || isTableGripSelected(node);
};

export default isCustomNodeSelected;