import { Node, ReactNodeViewRenderer } from '@tiptap/react'
import { FileUploadUIComponent } from './ui-component/file-upload-ui'

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
        ({ chain }) =>
          chain().insertContent({ type: this.name }).run(),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileUploadUIComponent)
  },
})

export default FileUpload
