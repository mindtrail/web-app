'use client'

import { useEffect, useState, ReactNode } from 'react'
import { SparklesIcon } from 'lucide-react'
import { EditorBubble, useEditor } from 'novel'
import { removeAIHighlight } from 'novel/extensions'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

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
    if (!isAIEditorOpen && editor) {
      removeAIHighlight(editor)
    }
  }, [isAIEditorOpen, editor])

  if (!editor) return null

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
      className={`flex items-center w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl`}
    >
      {isAIEditorOpen ? (
        <AISelector onOpenChange={setIsAIEditorOpen} />
      ) : (
        <>
          <Button
            className={`gap-2 rounded-none text-purple-500 shrink-0`}
            onClick={() => setIsAIEditorOpen(true)}
            variant='ghost'
          >
            <SparklesIcon className='h-5 w-5' />
            AI Tools
          </Button>

          <Separator orientation='vertical' className='h-4' />
          <NodeSelector />
          <Separator orientation='vertical' className='h-4' />

          <LinkSelector />
          <Separator orientation='vertical' className='h-4' />
          <TextFormatSelector />
          <Separator orientation='vertical' className='h-4' />
          <ColorSelector />
          {children}
        </>
      )}
    </EditorBubble>
  )
}
