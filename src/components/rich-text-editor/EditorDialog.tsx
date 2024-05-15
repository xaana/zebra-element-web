import React, { memo, useCallback, useMemo, useRef } from "react";
import { EditorContent, EditorContext } from "@tiptap/react";

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "../ui/dialog";
import { BlockEditor } from "../reports/BlockEditor";
import Editor from "./Editor";
import { ContentItemMenu, LinkMenu, TextMenuProps } from "../reports/menus";
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

import { Icon } from "@/components/ui/Icon";
import { TableOfContents } from "@/components/reports/TableOfContents";
import { TableRowMenu, TableColumnMenu } from "@/plugins/reports/extensions/Table/menus";
import ImageBlockMenu from "@/plugins/reports/extensions/ImageBlock/components/ImageBlockMenu";
import { cn } from "@/lib/utils";
import { ColumnsMenu } from "@/plugins/reports/extensions/MultiColumn/menus";
import { useAIState } from "@/plugins/reports/hooks/useAIState";
import { useChat } from "@/plugins/reports/hooks/use-chat";
import { useSidebar } from "@/plugins/reports/hooks/useSidebar";
import { useBlockEditor } from "@/plugins/reports/hooks/useBlockEditor";
import { Sidebar } from "@/components/reports/Sidebar";
import { ChatSidebar } from "@/components/reports/Chat/ChatSidebar";


const MemoButton = memo(Toolbar.Button);
const MemoColorPicker = memo(ColorPicker);
const MemoFontFamilyPicker = memo(FontFamilyPicker);
const MemoFontSizePicker = memo(FontSizePicker);
const MemoContentTypePicker = memo(ContentTypePicker);


const EditorDialog = (props: {
    trigger?: React.JSX.Element
    onDestroyCallback?: (data:string)=>void
    onSendCallback: (content: string, rawContent:string)=>void
}):React.JSX.Element => {
    const [open, setOpen] = React.useState(false);
    const { editor } = useBlockEditor({});

    const menuContainerRef = useRef(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    const leftSidebar = useSidebar();
    const rightSidebar = useSidebar();
    const chat =useChat({
        isOpen: rightSidebar.isOpen,
        open:rightSidebar.open,
        close: rightSidebar.close,
        toggle: rightSidebar.toggle,
    });
    const aiState = useAIState();
    const providerValue = useMemo(()=>{
        return {
            isAiLoading: aiState.isAiLoading,
            aiError: aiState.aiError,
            setIsAiLoading: aiState.setIsAiLoading,
            setAiError: aiState.setAiError,
            editor: editor,
            editorChat: chat,
        }
    }, [aiState, chat, editor])

    const handlePotentialCloseLeft = useCallback(() => {
        if (window.innerWidth < 1024) {
            leftSidebar.close();
        }
    }, [leftSidebar]);

    const EditorHeader = ({ editor }: TextMenuProps): JSX.Element => {
        const commands = useTextmenuCommands(editor);
        const states = useTextmenuStates(editor);
        const blockOptions = useTextmenuContentTypes(editor);

        return (
            <div className="flex-1 flex w-full relative justify-center overflow-y-auto z-30">
                <Toolbar.Wrapper className="border border-slate-300 shadow-xl">
                    <AIDropdown
                        onCompleteSentence={commands.onCompleteSentence}
                        onFixSpelling={commands.onFixSpelling}
                        onMakeLonger={commands.onMakeLonger}
                        onMakeShorter={commands.onMakeShorter}
                        onSimplify={commands.onSimplify}
                        onTldr={commands.onTldr}
                        onTone={commands.onTone}
                    />
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
                    <EditLinkPopover onSetLink={commands.onLink} />
                    <Popover>
                        <PopoverTrigger asChild>
                            <MemoButton active={!!states.currentHighlight} tooltip="Highlight text">
                                <Icon name="Highlighter" />
                            </MemoButton>
                        </PopoverTrigger>
                        <PopoverContent side="top" sideOffset={8} asChild>
                            <Surface className="p-1">
                                <MemoColorPicker
                                    color={states.currentHighlight}
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
                                    color={states.currentColor}
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
                </Toolbar.Wrapper>
            </div>
        );
    }

    const EditorFooter = (props: {
        onSendCallback: (content: string, rawContent:string) => void;
        onCancelCallback: () => void;
    }): React.JSX.Element => {

        const sendHandler = (): void => {
            props.onSendCallback && editor && props.onSendCallback(editor.getHTML(),editor.getText());
        };

        return (
            <div className="flex flex-row justify-end gap-x-3 pb-1 pr-4">
                <Button className="w-[100px]" variant="default" onClick={props.onCancelCallback}>
                    Cancel
                </Button>
                <Button className="w-[100px]" variant="default" onClick={sendHandler}>
                    Send
                </Button>
            </div>
        );
    };

    return (
        <EditorContext.Provider value={providerValue}>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {props.trigger ?? (<Button>
                        Open
                    </Button>)}
                </DialogTrigger>
                <DialogContent className="w-[90vw] max-w-[90vw] h-[95vh] p-0 overflow-hidden gap-y-1">
                    <div className="h-[45px]">
                        <EditorHeader editor={editor} />
                    </div>
                    <div style={{ height: "calc(-150px + 100vh)" }} className="rounded-b-md border-b-2 overflow-auto">
                        {/* <Sidebar side="left" isOpen={leftSidebar.isOpen}>
                            <TableOfContents onItemClick={handlePotentialCloseLeft} editor={editor} />
                        </Sidebar> */}
                        <div className="flex-1 flex h-max relative justify-center overflow-y-auto" ref={menuContainerRef}>
                            <EditorContent editor={editor} ref={editorRef} className="flex-1 overflow-y-auto" />
                            <ContentItemMenu editor={editor} />
                            <LinkMenu editor={editor} appendTo={menuContainerRef} />
                            <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                            <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                            <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                            <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
                        </div>
                        {/* <ChatSidebar sidebar={rightSidebar} /> */}
                    </div>
                    <div>
                        <EditorFooter
                            onCancelCallback={()=>{setOpen(false)}}
                            onSendCallback={(content: string, rawContent:string): void => {
                                props.onSendCallback(content, rawContent);
                                setOpen(false);
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </EditorContext.Provider>
    )
}

export default EditorDialog;
