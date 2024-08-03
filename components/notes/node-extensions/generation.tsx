import { useState } from 'react'
import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import { SparklesIcon, SettingsIcon, CirclePlayIcon, TerminalIcon } from 'lucide-react'
import { useCompletion } from 'ai/react'
import { toast } from 'sonner'
import Markdown from 'react-markdown'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/typography'
import { ScrollArea } from '@/components/ui/scroll-area'

const GenerationComponent = ({ node }: { node: any }) => {
  const [prompt, setPrompt] = useState(node.attrs.name || '')

  const { completion, complete, isLoading } = useCompletion({
    api: '/api/generate',
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error('You have reached your request limit for the day.')
        return
      }
    },
    onError: (e) => {
      toast.error(e.message)
    },
  })

  const handleGenerate = () => {
    if (!prompt) return
    complete(prompt, {
      body: { option: 'zap', command: 'Generate text based on this prompt' },
    })
  }

  return (
    <NodeViewWrapper className='my-4'>
      <div
        className='flex flex-col px-4 pt-2 pb-4 gap-2 rounded-lg border
        border-gray-300 bg-white shadow-sm'
      >
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            className='flex items-center gap-2'
            size='icon'
            disabled={!prompt || isLoading}
            onClick={handleGenerate}
          >
            <CirclePlayIcon
              className={`h-5 w-5 ${prompt && !isLoading ? 'text-primary' : ''}`}
            />
          </Button>

          <Label htmlFor='generation-prompt' className='flex items-center'>
            <SparklesIcon className='mr-2 h-4 w-4' />
            <Typography variant='small-semi' className='select-none'>
              AI Generation
            </Typography>
          </Label>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              // Handle settings logic here
              console.log('Opening settings')
            }}
          >
            <SettingsIcon className='h-5 w-5' />
          </Button>
        </div>
        <Textarea
          id='generation-prompt'
          autoFocus
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Enter prompt here.'
          className='!min-h-[60px]'
        />

        {completion && (
          <div className='flex flex-col mt-6 gap-4'>
            <div className='flex gap-2 px-2'>
              <TerminalIcon className='h-4 w-4' />
              <Typography variant='small-semi'>Result</Typography>
            </div>

            <div className='flex max-h-[200px]'>
              <ScrollArea>
                <div className='prose p-2 px-4 prose-sm'>
                  <Markdown>{completion}</Markdown>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
      <NodeViewContent className='hidden' />
    </NodeViewWrapper>
  )
}

export const Generation = Node.create({
  name: 'generation',
  group: 'block',
  draggable: true,
  selectable: true,

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
