import { useState, useCallback } from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import {
  SparklesIcon,
  SettingsIcon,
  CirclePlayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { useCompletion } from 'ai/react'
import { toast } from 'sonner'
import Markdown from 'react-markdown'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/typography'
import { ScrollArea } from '@/components/ui/scroll-area'

export const GenerationComponent = ({ node }: { node: any }) => {
  const [prompt, setPrompt] = useState(node.attrs.name || '')
  const [isExpanded, setIsExpanded] = useState(true)

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (prompt?.length < 5) return

      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleGenerate()
      }
    },
    [handleGenerate],
  )

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
            disabled={prompt?.length < 5 || isLoading}
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
        <div className='content is-editable'>content to be edited</div>
        <Textarea
          id='generation-prompt'
          autoFocus
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Enter prompt here.'
          className='!min-h-[60px]'
        />

        {completion && (
          <div className='flex flex-col mt-2 gap-4'>
            <Button
              variant='ghost'
              className='self-start flex gap-2 px-2'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDownIcon className='h-4 w-4' />
              ) : (
                <ChevronRightIcon className='h-4 w-4' />
              )}
              <Typography variant='small-semi'>Result</Typography>
            </Button>

            {isExpanded && (
              <div className='flex max-h-[200px]'>
                <ScrollArea>
                  <div className='prose p-2 px-4 prose-sm'>
                    <Markdown>{completion}</Markdown>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </div>
      <NodeViewContent className='content is-editable' />
    </NodeViewWrapper>
  )
}
