import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { PdfQueryMainView } from '@/extensions/PdfQuery/components/PdfQueryMainView'
import { v4 as uuid } from 'uuid'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pdfQuery: {
      setPdfQuery: () => ReturnType
    }
  }
}

export const PdfQuery = Node.create({
  name: 'pdfQueryBlock',
  group: 'block',
  draggable: true,

  parseHTML() {
    return [{ tag: `div.node-${this.name}` }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setPdfQuery:
        () =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({ type: this.name, attrs: { id: uuid() } })
            .run(),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(PdfQueryMainView)
  },
})
