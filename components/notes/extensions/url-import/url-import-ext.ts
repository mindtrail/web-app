import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import { URLImportUI } from './url-import-ui'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    url: {
      setURL: () => ReturnType
    }
  }
}

export const URLImport = Node.create({
  name: 'url-import',

  group: 'block',
  draggable: true,
  selectable: true,
  // content: 'inline*',

  addAttributes() {
    return {
      url: { default: '' },
      result: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="url"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { 'data-type': 'url', ...HTMLAttributes }]
  },

  addCommands() {
    return {
      setURL:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { url: '', result: '' },
          }),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(URLImportUI)
  },
})

export default URL
