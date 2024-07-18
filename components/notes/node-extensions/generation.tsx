import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { StarsIcon } from 'lucide-react'

const GenerationComponent = ({ node }: { node: any }) => {
  return (
    <NodeViewWrapper as='span'>
      <span className='inline-flex items-center rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800'>
        <StarsIcon className='mr-1 h-4 w-4' />
        {node.attrs.name}
        test 1234
      </span>
    </NodeViewWrapper>
  )
}

export const Generation = Node.create({
  name: 'generation',
  group: '',
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      name: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="generation"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'generation' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(GenerationComponent)
  },
})
