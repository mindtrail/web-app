'use client'

import { useState, useCallback } from 'react'
import { useCompletion } from 'ai/react'
import { ArrowUp } from 'lucide-react'
import { toast } from 'sonner'
import Markdown from 'react-markdown'
import { useEditor } from 'novel'
import { addAIHighlight } from 'novel/extensions'

import { Command, CommandInput } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

import { MagicIcon, CrazySpinnerIcon } from '@/components/ui/icons/custom'

import { AISelectorCommands } from './ai-selector-commands'
import { AICompletionCommands } from './ai-completion-command'

import { PopoverSelector } from '../popover-selector'

//TODO: I think it makes more sense to create a custom Tiptap extension for this functionality https://tiptap.dev/docs/editor/ai/introduction
interface AISelectorProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function AISelector({ isOpen, onOpenChange }: AISelectorProps) {
  const { editor } = useEditor()
  const [inputValue, setInputValue] = useState('')

  const { completion, complete, isLoading } = useCompletion({
    // id: "novel",
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

  const AISelectorTrigger = useCallback(
    () => (
      <Button className={`gap-1 rounded-none text-purple-500`} variant='ghost' size='sm'>
        <MagicIcon className='h-5 w-5' />
        Ask AI
      </Button>
    ),
    [],
  )

  const hasCompletion = completion.length > 0

  const AISelectorContent = useCallback(() => {
    if (!editor) return null

    return (
      <Command className='w-[350px]'>
        {hasCompletion && (
          <div className='flex max-h-[400px]'>
            <ScrollArea>
              <div className='prose p-2 px-4 prose-sm'>
                <Markdown>{completion}</Markdown>
              </div>
            </ScrollArea>
          </div>
        )}

        {isLoading && (
          <div className='flex h-12 w-full items-center px-4 text-sm font-medium text-muted-foreground text-purple-500'>
            <MagicIcon className='mr-2 h-4 w-4 shrink-0  ' />
            AI is thinking
            <div className='ml-2 mt-1'>
              <CrazySpinnerIcon />
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            <div className='relative'>
              <CommandInput
                value={inputValue}
                onValueChange={setInputValue}
                autoFocus
                placeholder={
                  hasCompletion
                    ? 'Tell AI what to do next'
                    : 'Ask AI to edit or generate...'
                }
                onFocus={() => addAIHighlight(editor)}
              />
              <Button
                size='icon'
                className='absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-purple-500 hover:bg-purple-900'
                onClick={() => {
                  if (completion)
                    return complete(completion, {
                      body: { option: 'zap', command: inputValue },
                    }).then(() => setInputValue(''))

                  const slice = editor.state.selection.content()
                  const text = editor.storage.markdown.serializer.serialize(slice.content)

                  complete(text, {
                    body: { option: 'zap', command: inputValue },
                  }).then(() => setInputValue(''))
                }}
              >
                <ArrowUp className='h-4 w-4' />
              </Button>
            </div>
            {hasCompletion ? (
              <AICompletionCommands
                onDiscard={() => {
                  editor.chain().unsetHighlight().focus().run()
                  onOpenChange(false)
                }}
                completion={completion}
              />
            ) : (
              <AISelectorCommands
                onSelect={(value, option) => complete(value, { body: { option } })}
              />
            )}
          </>
        )}
      </Command>
    )
  }, [complete, completion, editor, hasCompletion, inputValue, isLoading, onOpenChange])

  return (
    <PopoverSelector
      renderTrigger={AISelectorTrigger}
      renderContent={AISelectorContent}
      contentProps={{ className: 'w-60 p-0' }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    />
  )
}
