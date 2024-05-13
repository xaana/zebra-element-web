"use client";

// import { HocuspocusProvider } from '@hocuspocus/provider'

// import { API } from '@/lib/api'

import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import History from "@tiptap/extension-history";
import { common, createLowlight } from "lowlight";

import {
    AiWriter,
    AiDataQuery,
    AiTextModify,
    // AiImage,
    BlockquoteFigure,
    CharacterCount,
    Color,
    Document,
    Dropcursor,
    Emoji,
    Figcaption,
    FileHandler,
    Focus,
    FontFamily,
    FontSize,
    Heading,
    Highlight,
    HorizontalRule,
    ImageBlock,
    Link,
    // PdfQuery,
    Placeholder,
    Selection,
    SlashCommand,
    StarterKit,
    Subscript,
    Superscript,
    Table,
    TableOfContents,
    TableCell,
    TableHeader,
    TableRow,
    TextAlign,
    TextStyle,
    TrailingNode,
    Typography,
    Underline,
    emojiSuggestion,
    Columns,
    Column,
    TaskItem,
    TaskList,
} from ".";
import { ImageUpload } from "./ImageUpload";
import { TableOfContentsNode } from "./TableOfContentsNode";

import ReportsAPI from "@/lib/reportsApi";

// import { lowlight } from 'lowlight'
const lowlight = createLowlight(common);

interface ExtensionKitProps {
    userId?: string;
    userName?: string;
    userColor?: string;
}

export const ExtensionKit = ({ userId, userName = "Zebra" }: ExtensionKitProps): any => [
    Document,
    Columns,
    TaskList,
    TaskItem.configure({
        nested: true,
    }),
    AiTextModify,
    AiWriter.configure({
        authorId: userId,
        authorName: userName,
    }),
    AiDataQuery.configure({}),
    Column,
    Selection,
    Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
    }),
    HorizontalRule,
    StarterKit.configure({
        document: false,
        dropcursor: false,
        heading: false,
        horizontalRule: false,
        blockquote: false,
        history: false,
        codeBlock: false,
    }),
    CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: null,
    }),
    TextStyle,
    FontSize,
    FontFamily,
    Color,
    TrailingNode,
    Link.configure({
        openOnClick: false,
    }),
    Highlight.configure({ multicolor: true }),
    Underline,
    CharacterCount.configure({ limit: 50000 }),
    TableOfContents,
    TableOfContentsNode,
    ImageUpload.configure({
        clientId: userId,
        // clientId: provider?.document?.clientID,
    }),
    ImageBlock,
    FileHandler.configure({
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
        onDrop: (currentEditor, files, pos) => {
            files.forEach(async () => {
                const url = await ReportsAPI.uploadImage();

                currentEditor.chain().setImageBlockAt({ pos, src: url }).focus().run();
            });
        },
        onPaste: (currentEditor, files) => {
            files.forEach(async () => {
                const url = await ReportsAPI.uploadImage();

                return currentEditor
                    .chain()
                    .setImageBlockAt({
                        pos: currentEditor.state.selection.anchor,
                        src: url,
                    })
                    .focus()
                    .run();
            });
        },
    }),
    Emoji.configure({
        enableEmoticons: true,
        suggestion: emojiSuggestion,
    }),
    TextAlign.extend({
        addKeyboardShortcuts() {
            return {};
        },
    }).configure({
        types: ["heading", "paragraph"],
    }),
    Subscript,
    Superscript,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    Typography,
    // PdfQuery,
    Placeholder.configure({
        includeChildren: true,
        showOnlyCurrent: false,
        placeholder: () => "",
    }),
    SlashCommand,
    Focus,
    Figcaption,
    BlockquoteFigure,
    Dropcursor.configure({
        width: 2,
        class: "ProseMirror-dropcursor border-black",
    }),
    History,
];

export default ExtensionKit;
