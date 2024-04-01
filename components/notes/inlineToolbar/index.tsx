'use client'

import { useEffect, useState, ReactNode } from 'react'
import { EditorBubble, useEditor } from 'novel'
import { removeAIHighlight } from 'novel/extensions'

import { Button } from '@/components/ui/button'
import { MagicIcon } from '@/components/ui/icons/custom'
import { Separator } from '@/components/ui/separator'

import { AISelector } from './generative/ai-selector'
import { NodeSelector } from './selectors/node-selector'
import { LinkSelector } from './selectors/link-selector'
import { ColorSelector } from './selectors/color-selector'
import { TextButtons } from './selectors/text-buttons'

interface GenerativeMenuSwitchProps {
  children?: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}
export const GenerativeMenuSwitch = (props: GenerativeMenuSwitchProps) => {
  const { children, open, onOpenChange } = props
  const { editor } = useEditor()

  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)

  useEffect(() => {
    if (!open && editor) {
      removeAIHighlight(editor)
    }
  }, [open, editor])

  if (!editor) return null

  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? 'bottom-start' : 'top',
        onHidden: () => {
          onOpenChange(false)
          editor.chain().unsetHighlight().run()
        },
      }}
      className='flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl'
    >
      {open && <AISelector open={open} onOpenChange={onOpenChange} />}
      {open && (
        <>
          <Button
            className='gap-1 rounded-none text-purple-500'
            variant='ghost'
            onClick={() => onOpenChange(true)}
            size='sm'
          >
            <MagicIcon className='h-5 w-5' />
            Ask AI
          </Button>
          <Separator orientation='vertical' />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation='vertical' />

          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation='vertical' />
          <TextButtons />
          <Separator orientation='vertical' />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          {children}
        </>
      )}
    </EditorBubble>
  )
}
