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

  return (
    <EditorBubble
      tippyOptions={{
        // appendTo: document.body, // @TODO: check the warning when removing this from Tippy.js
        placement: isAIEditorOpen ? 'bottom' : 'top', //  :
        onHidden: () => {
          editor.chain().unsetHighlight().run()
        },
      }}
      className={`flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl ${isAIEditorOpen && 'opacity-0'}`}
    >
      <AISelector isOpen={isAIEditorOpen} onOpenChange={setIsAIEditorOpen} />
      <Separator orientation='vertical' />
      <NodeSelector />
      <Separator orientation='vertical' />

      <LinkSelector />
      <Separator orientation='vertical' />
      <TextFormatSelector />
      <Separator orientation='vertical' />
      <ColorSelector />
      {children}
    </EditorBubble>
  )
}
