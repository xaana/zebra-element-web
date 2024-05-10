import "./style.scss"

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { Bold, Code, Italic, List, ListOrdered, Quote, Redo, Strikethrough, Undo } from "lucide-react";

import { Button } from "../ui/button"
import { Toggle } from "../ui/toggleAlt";

const MenuBar = (props: {onDestroyCallback?:(data:string)=>void}):React.JSX.Element => {
    const { editor } = useCurrentEditor();

    React.useEffect(()=>{
        return ()=>{
            console.log(props.onDestroyCallback);
            props.onDestroyCallback && editor && props.onDestroyCallback(editor.getText())
        }
    }, [])

    if (!editor) {
        return (<></>);
    }

    return (
        <div className="flex flex-nowrap justify-start w-full p-3 gap-x-1">
            <Toggle
                onChange={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
            >
                <Bold />
            </Toggle>
            <Toggle
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
                <Italic />
            </Toggle>
            <Toggle
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
            >
                <Strikethrough />
            </Toggle>
            <Button
                variant="outline"
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
            >
                Clear Marks
            </Button>
            <Button
                variant="outline"
                onClick={() => editor.chain().focus().setParagraph().run()}
            >
                Paragraph
            </Button>

            <Button
                variant="outline"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
                Horizontal Rule
            </Button>
            <Button
                variant="outline"
                onClick={() => editor.chain().focus().setHardBreak().run()}
            >
                Hard Break
            </Button>

            <Toggle
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List />
            </Toggle>
            <Toggle
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered />
            </Toggle>
            <Toggle
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
                <Code />
            </Toggle>
            <Toggle
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote />
            </Toggle>

            <Button
                variant="outline"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <Undo />
            </Button>
            <Button
                variant="outline"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                <Redo />
            </Button>
        </div>
    );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

const EditorFooter = (props:{
    onSendCallback:(content: string)=>void,
    onCancelCallback:()=>void
}):React.JSX.Element => {
    const { editor } = useCurrentEditor();
    if (!editor) {
        return (<></>);
    }

    const sendHandler = ():void => {
        props.onSendCallback && editor && props.onSendCallback(editor.getHTML())
    }

    return (
        <div className="flex flex-row justify-end gap-x-3">
            <Button
                className="w-[100px]"
                variant="default"
                onClick={props.onCancelCallback}
            >
                Cancel
            </Button>
            <Button
                className="w-[100px]"
                variant="default"
                onClick={sendHandler}
            >
                Send
            </Button>
        </div>
    )
}

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

const App = (props: {
    onDestroyCallback?: (data:string)=>void
    onSendCallback: (content:string)=>void,
    onCancelCallback: ()=>void
}):React.JSX.Element => {
    return (
        <EditorProvider
            slotBefore={<MenuBar onDestroyCallback={props.onDestroyCallback} />}
            slotAfter={<EditorFooter onCancelCallback={props.onCancelCallback}
                onSendCallback={(content:string):void=>{
                    props.onSendCallback(content);
                    props.onCancelCallback();
            }} />}
            extensions={extensions}
            content={content}
        />
    );
};

export default App;
