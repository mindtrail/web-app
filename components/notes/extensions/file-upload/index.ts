import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import { FileUploadComponent } from './ui'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fileUpload: {
      setFileUpload: () => ReturnType
    }
  }
}

export const FileUpload = Node.create({
  name: 'fileUpload',

  defining: true,
  draggable: true,
  group: 'block',
  inline: false,
  isolating: true,
  selectable: true,

  parseHTML() {
    return [{ tag: `div[data-type="${this.name}"]` }]
  },
  renderHTML() {
    return ['div', { 'data-type': this.name }]
  },
  addCommands() {
    return {
      setFileUpload:
        () =>
        ({ commands }) =>
          commands.insertContent(`<div data-type="${this.name}"></div>`),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileUploadComponent)
  },
})

export default FileUpload
