import { Editor } from "@tiptap/react";
import { useCallback, useContext } from "react";

import { EditorContext } from "@/components/rich-text-editor/context/EditorContext";
import { generateText } from "@/plugins/reports/utils/generateText";

export const TextModifications = {
    SIMPLIFY: { value: "simplify", label: "Simplify" },
    FIX_SPELLING: { value: "fix_spelling", label: "Fix Spelling" },
    MAKE_SHORTER: { value: "make_shorter", label: "Make Shorter" },
    MAKE_LONGER: { value: "make_longer", label: "Make Longer" },
    CHANGE_TONE: { value: "change_tone", label: "Change Tone" },
    TLDR: { value: "tldr", label: "Tl;dr" },
    EMOJIFY: { value: "emojify", label: "Emojify" },
    COMPLETE_SENTENCE: { value: "complete_sentence", label: "Complete Sentence" },
} as const;

export const useTextmenuCommands = (editor: Editor): any => {
    const { editorChat } = useContext(EditorContext);

    const onUndo = useCallback(() => editor.chain().focus().undo().run(), [editor]);
    const onRedo = useCallback(() => editor.chain().focus().redo().run(), [editor]);
    const onBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor]);
    const onItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor]);
    const onStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor]);
    const onUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor]);
    const onCode = useCallback(() => editor.chain().focus().toggleCode().run(), [editor]);
    const onCodeBlock = useCallback(() => editor.chain().focus().toggleCodeBlock().run(), [editor]);

    const onSubscript = useCallback(() => editor.chain().focus().toggleSubscript().run(), [editor]);
    const onSuperscript = useCallback(() => editor.chain().focus().toggleSuperscript().run(), [editor]);
    const onAlignLeft = useCallback(() => editor.chain().focus().setTextAlign("left").run(), [editor]);
    const onAlignCenter = useCallback(() => editor.chain().focus().setTextAlign("center").run(), [editor]);
    const onAlignRight = useCallback(() => editor.chain().focus().setTextAlign("right").run(), [editor]);
    const onAlignJustify = useCallback(() => editor.chain().focus().setTextAlign("justify").run(), [editor]);

    const onChangeColor = useCallback((color: string) => editor.chain().setColor(color).run(), [editor]);
    const onClearColor = useCallback(() => editor.chain().focus().unsetColor().run(), [editor]);

    const onChangeHighlight = useCallback((color: string) => editor.chain().setHighlight({ color }).run(), [editor]);
    const onClearHighlight = useCallback(() => editor.chain().focus().unsetHighlight().run(), [editor]);

    const modifyText = useCallback(
        async (task: (typeof TextModifications)[keyof typeof TextModifications], tone?: string) => {
            if (!editorChat) return;
            editorChat.open();
            await generateText(task.value, editor, editorChat, tone);
        },
        [editor, editorChat],
    );

    const onSimplify = useCallback(async () => await modifyText(TextModifications.SIMPLIFY), [modifyText]);
    // TODO: Fix logic for selection count in order to enable; Errors currently
    // const onEmojify = useCallback(
    //   async () => await modifyText(TextModifications.EMOJIFY),
    //   [modifyText]
    // )
    const onCompleteSentence = useCallback(
        async () => await modifyText(TextModifications.COMPLETE_SENTENCE),
        [modifyText],
    );
    const onFixSpelling = useCallback(async () => await modifyText(TextModifications.FIX_SPELLING), [modifyText]);
    const onMakeLonger = useCallback(async () => await modifyText(TextModifications.MAKE_LONGER), [modifyText]);
    const onMakeShorter = useCallback(async () => await modifyText(TextModifications.MAKE_SHORTER), [modifyText]);
    const onTldr = useCallback(async () => await modifyText(TextModifications.TLDR), [modifyText]);
    const onTone = useCallback(
        async (tone: string) => await modifyText(TextModifications.CHANGE_TONE, tone),
        [modifyText],
    );
    // const onSimplify = useCallback(() => editor.chain().focus().aiSimplify().run(), [editor])
    // const onEmojify = useCallback(() => editor.chain().focus().aiEmojify().run(), [editor])
    // const onCompleteSentence = useCallback(() => editor.chain().focus().aiComplete().run(), [editor])
    // const onFixSpelling = useCallback(() => editor.chain().focus().aiFixSpellingAndGrammar().run(), [editor])
    // const onMakeLonger = useCallback(() => editor.chain().focus().aiExtend().run(), [editor])
    // const onMakeShorter = useCallback(() => editor.chain().focus().aiShorten().run(), [editor])
    // const onTldr = useCallback(() => editor.chain().focus().aiTldr().run(), [editor])
    // const onTone = useCallback((tone: string) => editor.chain().focus().aiAdjustTone(tone).run(), [editor])
    // const onTranslate = useCallback((language: Language) => editor.chain().focus().aiTranslate(language).run(), [editor])
    const onLink = useCallback(
        (url: string, inNewTab?: boolean) =>
            editor
                .chain()
                .focus()
                .setLink({ href: url, target: inNewTab ? "_blank" : "" })
                .run(),
        [editor],
    );

    const onSetFont = useCallback(
        (font: string) => {
            if (!font || font.length === 0) {
                return editor.chain().focus().unsetFontFamily().run();
            }
            return editor.chain().focus().setFontFamily(font).run();
        },
        [editor],
    );

    const onSetFontSize = useCallback(
        (fontSize: string) => {
            if (!fontSize || fontSize.length === 0) {
                return editor.chain().focus().unsetFontSize().run();
            }
            return editor.chain().focus().setFontSize(fontSize).run();
        },
        [editor],
    );

    return {
        onUndo,
        onRedo,
        onBold,
        onItalic,
        onStrike,
        onUnderline,
        onCode,
        onCodeBlock,
        onSubscript,
        onSuperscript,
        onAlignLeft,
        onAlignCenter,
        onAlignRight,
        onAlignJustify,
        onChangeColor,
        onClearColor,
        onChangeHighlight,
        onClearHighlight,
        onSetFont,
        onSetFontSize,
        onSimplify,
        // onEmojify,
        onCompleteSentence,
        onFixSpelling,
        onMakeLonger,
        onMakeShorter,
        onTldr,
        onTone,
        onLink,
    };
};
