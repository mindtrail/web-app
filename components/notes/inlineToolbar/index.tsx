'use client'

import { useEffect, useState, ReactNode } from 'react'
import { EditorBubble, useEditor } from 'novel'
import { removeAIHighlight } from 'novel/extensions'

import { Button } from '@/components/ui/button'
import { MagicIcon } from '@/components/ui/icons/custom'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components//ui/popover'

import { AISelector } from './generative/ai-selector'
import { NodeSelector } from './text-selectors/node-selector'
import { LinkSelector } from './text-selectors/link-selector'
import { ColorSelector } from './text-selectors/color-selector'
import { TextFormatSelector } from './text-selectors/text-format-selector'

interface InlineToolbarProps {
  children?: ReactNode
}
export const InlineToolbar = (props: InlineToolbarProps) => {
  const { children } = props
  const { editor } = useEditor()

  const [isAIEditorOpen, setIsAIEditorOpen] = useState(false)

  useEffect(() => {
    if (!open && editor) {
      removeAIHighlight(editor)
    }
  }, [isAIEditorOpen, editor])

  if (!editor) return null

  console.log(isAIEditorOpen)

  // if (isAIEditorOpen) {
  // return
  // }

  return (
    <EditorBubble
      tippyOptions={{
        // appendTo: document.body, // @TODO: check the warning when removing this from Tippy.js
        placement: isAIEditorOpen ? 'bottom' : 'top', //  :
        onHidden: () => {
          setIsAIEditorOpen(false)
          editor.chain().unsetHighlight().run()
        },
      }}
      className={`flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl`}
    >
      {isAIEditorOpen ? (
        <AISelector onOpenChange={setIsAIEditorOpen} />
      ) : (
        <>
          <Button
            className={`gap-1 rounded-none text-purple-500`}
            onClick={() => setIsAIEditorOpen(true)}
            variant='ghost'
            size='sm'
          >
            <MagicIcon className='h-5 w-5' />
            Ask AI
          </Button>

          <Separator orientation='horizontal' className='w-2' />
          <NodeSelector />
          <Separator orientation='horizontal' className='w-2' />

          <LinkSelector />
          <Separator orientation='horizontal' className='w-2' />
          <TextFormatSelector />
          <Separator orientation='horizontal' className='w-2' />
          <ColorSelector />
          {children}
        </>
      )}
    </EditorBubble>
  )
}
