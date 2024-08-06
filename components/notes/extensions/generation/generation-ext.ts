import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import { GenerationComponent } from './generation-ui'

export const Generation = Node.create({
  name: 'generation',
  group: 'block',
  draggable: true,
  selectable: true,
  // content: 'inline*',

  addAttributes() {
    return { genResult: { default: '' } }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="generation"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'generation' }), 0]
  },

  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-Enter': () => {
  //       return this.editor
  //         .chain()
  //         .insertContentAt(this.editor.state.selection.head, { type: this.type.name })
  //         .focus()
  //         .run()
  //     },
  //   }
  // },

  addNodeView() {
    return ReactNodeViewRenderer(GenerationComponent)
  },
})
