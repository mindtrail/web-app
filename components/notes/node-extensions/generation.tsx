import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { SparklesIcon, SettingsIcon, PlayIcon } from 'lucide-react'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/typography'

const GenerationComponent = ({ node }: { node: any }) => {
  console.log(111, node)
  const [prompt, setPrompt] = useState(node.attrs.name || '')

  return (
    <NodeViewWrapper className='my-4'>
      <div className='flex flex-col px-4 py-2 gap-4 rounded-lg border border-gray-300 bg-white shadow-sm'>
        <Label className='flex items-center'>
          <SparklesIcon className='mr-2 h-4 w-4' />
          <Typography variant='small-semi'>AI Generation</Typography>
        </Label>
        <Textarea
          autoFocus
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Enter prompt here.'
          className='!min-h-[60px]'
        />
        <div className='flex items-center justify-between'>
          <Button
            className='flex items-center gap-2'
            variant='outline'
            onClick={() => {
              // Handle generation logic here
              console.log('Generating text for:', prompt)
            }}
          >
            <PlayIcon className='h-4 w-4' />
            Preview
          </Button>
          <Button
            className='flex items-center gap-2'
            variant='outline'
            onClick={() => {
              // Handle generation logic here
              console.log('Generating text for:', prompt)
            }}
          >
            <SettingsIcon className='h-4 w-4' />
            Configure
          </Button>
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export const Generation = Node.create({
  name: 'generation',
  group: 'block',
  selectable: false,

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
        tag: 'div[data-type="generation"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'generation' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(GenerationComponent)
  },
})
