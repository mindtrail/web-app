import { ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes } from '@tiptap/core'
import { Node } from '@tiptap/core'
import { FileViewerUIComponent } from './file-viewer-ui'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fileViewer: {
      setFileViewer: (attributes: {
        src: string
        filename: string
        fileType: string
      }) => ReturnType
    }
  }
}

export const FileViewer = Node.create({
  name: 'fileViewer',

  group: 'block',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      src: {
        default: '',
      },
      filename: {
        default: '',
      },
      fileType: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="file-viewer"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'file-viewer' })]
  },

  addCommands() {
    return {
      setFileViewer:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileViewerUIComponent)
  },
})
