import React, { useState, memo, useCallback, useMemo, useRef, useContext } from "react";
import { Editor, EditorContent } from "@tiptap/react";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { ContentItemMenu, LinkMenu, TextMenu, TextMenuProps } from "../reports/menus";
import { AIDropdown } from "../reports/menus/TextMenu/components/AIDropdown";
import { ContentTypePicker } from "../reports/menus/TextMenu/components/ContentTypePicker";
import { EditLinkPopover } from "../reports/menus/TextMenu/components/EditLinkPopover";
import { FontFamilyPicker } from "../reports/menus/TextMenu/components/FontFamilyPicker";
import { FontSizePicker } from "../reports/menus/TextMenu/components/FontSizePicker";
import { useTextmenuCommands } from "../reports/menus/TextMenu/hooks/useTextmenuCommands";
import { useTextmenuContentTypes } from "../reports/menus/TextMenu/hooks/useTextmenuContentTypes";
import { useTextmenuStates } from "../reports/menus/TextMenu/hooks/useTextmenuStates";
import { ColorPicker } from "../reports/panels";
import { Surface } from "../ui/Surface";
import { Toolbar } from "../ui/Toolbar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { EditorInfo } from "../reports/BlockEditor/EditorInfo";
import { IconZebra } from "../ui/icons";
import { Mail, SendHorizontal, ChevronDown, PanelRightClose, PanelRight } from "lucide-react";

import { Icon } from "@/components/ui/Icon";
import { TableOfContents } from "@/components/reports/TableOfContents";
import { TableRowMenu, TableColumnMenu } from "@/plugins/reports/extensions/Table/menus";
import ImageBlockMenu from "@/plugins/reports/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "@/plugins/reports/extensions/MultiColumn/menus";
import { useAIState } from "@/plugins/reports/hooks/useAIState";
import { Chat, useChat } from "@/plugins/reports/hooks/use-chat";
import { SidebarState, useSidebar } from "@/plugins/reports/hooks/useSidebar";
import { useBlockEditor } from "@/plugins/reports/hooks/useBlockEditor";
import { Sidebar } from "@/components/reports/Sidebar";
import { EditorContext } from "@/plugins/reports/context/EditorContext";
import { ChatSidebar } from "@/components/reports/Chat/ChatSidebar";
import { LinkEditorPanel } from "@/components/reports/panels";
import classNames from "classnames";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { MatrixEvent } from "matrix-js-sdk/src/matrix";
// import ReplyPreview from "matrix-react-sdk/src/components/views/rooms/ReplyPreview";

const MemoButton = memo(Toolbar.Button);
const MemoColorPicker = memo(ColorPicker);
const MemoFontFamilyPicker = memo(FontFamilyPicker);
const MemoFontSizePicker = memo(FontSizePicker);
const MemoContentTypePicker = memo(ContentTypePicker);

type CharacterCountProps = {
    characters: () => number;
    words: () => number;
};

const EditorDialog = (props: {
    trigger?: React.JSX.Element;
    // editorReply?: MatrixEvent;
    editorContent: string;
    onSendCallback: (content: string, rawContent: string) => void;
    onScheduleSendCallback: (content: string, rawContent: string) => void;
    onDestroyCallback?: (data: string) => void;
}): React.JSX.Element => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    // const ydoc = useMemo(() => new YDoc(), []);
    // const { editor } = useBlockEditor({ydoc:ydoc});
    const { editor } = useBlockEditor({});

    const menuContainerRef = useRef(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const leftSidebar = useSidebar();
    const rightSidebar = useSidebar();
    const chat: Chat = useChat({
        isOpen: rightSidebar.isOpen,
        open: rightSidebar.open,
        close: rightSidebar.close,
        toggle: rightSidebar.toggle,
    });
    const aiState = useAIState();
    const providerValue = useMemo(() => {
        return {
            isAiLoading: aiState.isAiLoading,
            aiError: aiState.aiError,
            setIsAiLoading: aiState.setIsAiLoading,
            setAiError: aiState.setAiError,
            editor: editor,
            editorChat: chat,
        };
    }, [aiState, chat, editor]);

    const characterCount: CharacterCountProps = editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
    };

    const handlePotentialCloseLeft = useCallback(() => {
        if (window.innerWidth < 1024) {
            leftSidebar.close();
        }
    }, [leftSidebar]);

    const handleOpenClose = (open: boolean) => {
        if (open) {
            setOpen(true);
            // load content from state or message composer
            let initialContent = content ? content : props.editorContent;
            editor?.commands.setContent({
                type: "doc",
                content: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "text",
                                text: initialContent,
                            },
                        ],
                    },
                ],
            });
        } else {
            // save current editor content to state
            setContent(editor?.getText() || "");
            setOpen(false);
        }
    };

    if (!editor) {
        return <></>;
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenClose}>
            <DialogTrigger asChild>{props.trigger ?? <Button>Open</Button>}</DialogTrigger>
            <DialogContent className="p-0 overflow-hidden" style={{ gap: 0, width: 1100, height: "80%" }}>
                <EditorContext.Provider value={providerValue}>
                    <div style={{ height: 45, marginTop: 15 }}>
                        <EditorHeader editor={editor} characterCount={characterCount} rightSidebar={rightSidebar} />
                    </div>
                    {/* {props.editorReply && (
                        <div style={{ margin: "16px 64px 0px 64px" }}>
                            <ReplyPreview replyToEvent={props.editorReply} isEditor={true} />
                        </div>
                    )} */}

                    <div
                        style={{
                            // height: props.editorReply ? "calc(-194px + 80vh)" : "calc(-130px + 80vh)",
                            height: "calc(-130px + 80vh)",
                            paddingRight: rightSidebar.isOpen ? 300 : 0,
                        }}
                        className="w-full overflow-y-auto relative flex"
                    >
                        {/* <Sidebar side="left" isOpen={leftSidebar.isOpen}>
                            <TableOfContents onItemClick={handlePotentialCloseLeft} editor={editor} />
                        </Sidebar> */}
                        <div
                            className="flex-1 flex h-full relative justify-center overflow-y-auto"
                            ref={menuContainerRef}
                        >
                            <EditorContent
                                editor={editor}
                                ref={editorRef}
                                className="flex-1 overflow-y-auto"
                                style={{ padding: "66px 64px 0px 64px" }}
                            />
                            <ContentItemMenu editor={editor} />
                            <LinkMenu editor={editor} appendTo={menuContainerRef} />
                            <TextMenu editor={editor} />
                            <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                            <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                            <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
                        </div>
                    </div>
                    <div style={{ height: "calc(-130px + 80vh)", top: 65, right: 0, position: "absolute" }}>
                        <ChatSidebar sidebar={rightSidebar} />
                    </div>
                    <div style={{ height: 50 }}>
                        <EditorFooter
                            editor={editor}
                            onScheduleSendCallback={(content: string, rawContent: string): void => {
                                props.onScheduleSendCallback(content, rawContent);
                                setContent("");
                                setOpen(false);
                            }}
                            onSendCallback={(content: string, rawContent: string): void => {
                                props.onSendCallback(content, rawContent);
                                setContent("");
                                setOpen(false);
                            }}
                        />
                    </div>
                </EditorContext.Provider>
            </DialogContent>
        </Dialog>
    );
};

const EditorHeader = ({
    editor,
    characterCount,
    rightSidebar,
}: {
    editor: Editor;
    characterCount: CharacterCountProps;
    rightSidebar: SidebarState;
}): JSX.Element => {
    const commands = useTextmenuCommands(editor);
    const states = useTextmenuStates(editor);
    const blockOptions = useTextmenuContentTypes(editor);

    return (
        <div className="flex-1 flex w-full relative justify-center overflow-y-auto">
            <Toolbar.Wrapper className="border border-slate-300 shadow-xl z-30 border-t-0">
                {/* <Toolbar.Button
                        tooltip={leftSidebar.isOpen ? "Close sidebar" : "Open sidebar"}
                        onClick={leftSidebar.toggle}
                        active={leftSidebar.isOpen}
                        className={leftSidebar.isOpen ? "bg-transparent" : ""}
                    >
                        <Icon name={leftSidebar.isOpen ? "PanelLeftClose" : "PanelLeft"} />
                    </Toolbar.Button> */}
                <div className="flex items-center mx-4">
                    <div className="flex flex-col justify-center">
                        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            {characterCount.words()} {characterCount.words() === 1 ? "word" : "words"}
                        </div>
                        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            {characterCount.characters()}{" "}
                            {characterCount.characters() === 1 ? "character" : "characters"}
                        </div>
                    </div>
                </div>
                <Toolbar.Divider />

                {/* <AIDropdown
                    onCompleteSentence={commands.onCompleteSentence}
                    onFixSpelling={commands.onFixSpelling}
                    onMakeLonger={commands.onMakeLonger}
                    onMakeShorter={commands.onMakeShorter}
                    onSimplify={commands.onSimplify}
                    // onTldr={commands.onTldr}
                    onTone={commands.onTone}
                /> */}

                <Toolbar.Button onClick={commands.onUndo} disabled={!editor.can().chain().focus().undo().run()}>
                    <Icon name="Undo" />
                </Toolbar.Button>
                <Toolbar.Button onClick={commands.onRedo} disabled={!editor.can().chain().focus().redo().run()}>
                    <Icon name="Redo" />
                </Toolbar.Button>
                <Toolbar.Divider />
                <MemoContentTypePicker options={blockOptions} />
                <MemoFontFamilyPicker onChange={commands.onSetFont} value={states.currentFont || ""} />
                <MemoFontSizePicker onChange={commands.onSetFontSize} value={states.currentSize || ""} />
                <Toolbar.Divider />
                <MemoButton
                    tooltip="Bold"
                    tooltipShortcut={["Mod", "B"]}
                    onClick={commands.onBold}
                    active={states.isBold}
                >
                    <Icon name="Bold" />
                </MemoButton>
                <MemoButton
                    tooltip="Italic"
                    tooltipShortcut={["Mod", "I"]}
                    onClick={commands.onItalic}
                    active={states.isItalic}
                >
                    <Icon name="Italic" />
                </MemoButton>
                <MemoButton
                    tooltip="Underline"
                    tooltipShortcut={["Mod", "U"]}
                    onClick={commands.onUnderline}
                    active={states.isUnderline}
                >
                    <Icon name="Underline" />
                </MemoButton>
                <MemoButton
                    tooltip="Strikehrough"
                    tooltipShortcut={["Mod", "X"]}
                    onClick={commands.onStrike}
                    active={states.isStrike}
                >
                    <Icon name="Strikethrough" />
                </MemoButton>
                <MemoButton
                    tooltip="Code"
                    tooltipShortcut={["Mod", "E"]}
                    onClick={commands.onCode}
                    active={states.isCode}
                >
                    <Icon name="Code" />
                </MemoButton>
                <MemoButton tooltip="Code block" onClick={commands.onCodeBlock}>
                    <Icon name="SquareCode" />
                </MemoButton>

                <Popover>
                    <PopoverTrigger asChild>
                        <MemoButton tooltip="Set Link">
                            <Icon name="Link" />
                        </MemoButton>
                    </PopoverTrigger>
                    <PopoverContent>
                        <LinkEditorPanel onSetLink={commands.onLink} />
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <MemoButton active={!!states.currentHighlight} tooltip="Highlight text">
                            <Icon name="Highlighter" />
                        </MemoButton>
                    </PopoverTrigger>
                    <PopoverContent side="top" sideOffset={8} asChild>
                        <Surface className="p-1">
                            <MemoColorPicker
                                currentColor={states.currentHighlight}
                                onChange={commands.onChangeHighlight}
                                onClear={commands.onClearHighlight}
                            />
                        </Surface>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <MemoButton active={!!states.currentColor} tooltip="Text color">
                            <Icon name="Palette" />
                        </MemoButton>
                    </PopoverTrigger>
                    <PopoverContent side="top" sideOffset={8} asChild>
                        <Surface className="p-1">
                            <MemoColorPicker
                                currentColor={states.currentColor}
                                onChange={commands.onChangeColor}
                                onClear={commands.onClearColor}
                            />
                        </Surface>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <MemoButton tooltip="More options">
                            <Icon name="EllipsisVertical" />
                        </MemoButton>
                    </PopoverTrigger>
                    <PopoverContent side="top" asChild>
                        <Toolbar.Wrapper>
                            <MemoButton
                                tooltip="Subscript"
                                tooltipShortcut={["Mod", "."]}
                                onClick={commands.onSubscript}
                                active={states.isSubscript}
                            >
                                <Icon name="Subscript" />
                            </MemoButton>
                            <MemoButton
                                tooltip="Superscript"
                                tooltipShortcut={["Mod", ","]}
                                onClick={commands.onSuperscript}
                                active={states.isSuperscript}
                            >
                                <Icon name="Superscript" />
                            </MemoButton>
                            <Toolbar.Divider />
                            <MemoButton
                                tooltip="Align left"
                                tooltipShortcut={["Shift", "Mod", "L"]}
                                onClick={commands.onAlignLeft}
                                active={states.isAlignLeft}
                            >
                                <Icon name="AlignLeft" />
                            </MemoButton>
                            <MemoButton
                                tooltip="Align center"
                                tooltipShortcut={["Shift", "Mod", "E"]}
                                onClick={commands.onAlignCenter}
                                active={states.isAlignCenter}
                            >
                                <Icon name="AlignCenter" />
                            </MemoButton>
                            <MemoButton
                                tooltip="Align right"
                                tooltipShortcut={["Shift", "Mod", "R"]}
                                onClick={commands.onAlignRight}
                                active={states.isAlignRight}
                            >
                                <Icon name="AlignRight" />
                            </MemoButton>
                            <MemoButton
                                tooltip="Justify"
                                tooltipShortcut={["Shift", "Mod", "J"]}
                                onClick={commands.onAlignJustify}
                                active={states.isAlignJustify}
                            >
                                <Icon name="AlignJustify" />
                            </MemoButton>
                        </Toolbar.Wrapper>
                    </PopoverContent>
                </Popover>
                <Toolbar.Divider />
                <MemoButton tooltip="Toggle Zebra" onClick={rightSidebar.toggle} active={rightSidebar.isOpen}>
                    <IconZebra className="h-6 w-6 fill-primary dark:fill-white" />
                </MemoButton>
                {/* <Toggle
                        aria-label="Toggle bold"
                        size="sm"
                        // onClick={toggleRightSidebar}
                        className="relative"
                        pressed={rightSidebar.isOpen}
                        onPressedChange={() => rightSidebar.toggle}
                    >
                        <IconZebra className="h-6 w-6 fill-primary dark:fill-white" />
                    </Toggle> */}
            </Toolbar.Wrapper>
        </div>
    );
};

const EditorFooter = (props: {
    editor: Editor;
    onSendCallback: (content: string, rawContent: string) => void;
    onScheduleSendCallback: (content: string, rawContent: string) => void;
}): React.JSX.Element => {
    const { editorChat } = useContext(EditorContext);

    const handleSend = (): void => {
        editorChat?.reset();
        props.onSendCallback?.(props.editor.getHTML(), props.editor.getText());
    };

    // const handelMail = (): void => {
    //     window.open("mailto:?to=&body=AAA,&subject=BBB");
    // };

    return (
        <div className="flex flex-row justify-end pt-2 pr-4 border-t">
            {/* <Button className="px-8 rounded-full border-0 shadow-none" variant="outline" onClick={handelMail}>
                    <Mail size={20} />
                </Button>
                <DropdownMenu>
                    <div>
                        <DropdownMenuTrigger>
                            <div className="mx-4 border rounded-full" style={{ padding: 7 }}>
                                <ChevronDown size={20} />
                            </div>
                        </DropdownMenuTrigger>
                    </div>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={props.onScheduleSendCallback}>Schedule Send</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}
            <Button className="px-8 rounded-full border-0 shadow-none" variant="outline" onClick={handleSend}>
                <SendHorizontal size={20} />
            </Button>
        </div>
    );
};

export default EditorDialog;
