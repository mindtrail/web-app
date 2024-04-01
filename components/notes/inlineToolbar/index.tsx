'use client'

import { useEffect, useState, useRef, ReactNode } from 'react'
import { EditorBubble, useEditor } from 'novel'
import { removeAIHighlight } from 'novel/extensions'

import { Button } from '@/components/ui/button'
import { MagicIcon } from '@/components/ui/icons/custom'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverContent, PopoverTrigger } from '@/components//ui/popover'

import { AISelector } from '../generative/ai-selector'
import { NodeSelector } from './selectors/node-selector'
import { LinkSelector } from './selectors/link-selector'
import { ColorSelector } from './selectors/color-selector'
import { TextButtons } from './selectors/text-buttons'

interface InlineToolbarProps {
  children?: ReactNode
}
export const InlineToolbar = (props: InlineToolbarProps) => {
  const { children } = props
  const { editor } = useEditor()
  // const toolbarRef = useRef<HTMLDivElement>(null)

  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openAIEditor, setOpenAIEditor] = useState(false)

  useEffect(() => {
    if (!open && editor) {
      removeAIHighlight(editor)
    }
  }, [openAIEditor, editor])

  if (!editor) return null

  return (
    <EditorBubble
      tippyOptions={{
        // appendTo: document.body, // @TODO: check the warning when removing this from Tippy.js
        placement: openAIEditor ? 'bottom-start' : 'top', //  :
        onHidden: () => {
          setOpenAIEditor(false)
          editor.chain().unsetHighlight().run()
        },
      }}
      className={`flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl ${openAIEditor && 'opacity-0'}`}
    >
      <Popover modal={true} open={openAIEditor} onOpenChange={setOpenAIEditor}>
        <PopoverTrigger
          asChild
          className='gap-2 rounded-none border-none hover:bg-accent focus:ring-0'
        >
          <Button
            className={`gap-1 rounded-none text-purple-500`}
            variant='ghost'
            onClick={() => setOpenAIEditor(true)}
            size='sm'
          >
            <MagicIcon className='h-5 w-5' />
            Ask AI
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={-35} align='start' className='w-48 p-1'>
          <AISelector onOpenChange={setOpenAIEditor} />
        </PopoverContent>
      </Popover>

      <Separator orientation='vertical' />
      <NodeSelector open={openNode} onOpenChange={setOpenNode} />
      <Separator orientation='vertical' />

      <LinkSelector open={openLink} onOpenChange={setOpenLink} />
      <Separator orientation='vertical' />
      <TextButtons />
      <Separator orientation='vertical' />
      <ColorSelector open={openColor} onOpenChange={setOpenColor} />
      {children}
    </EditorBubble>
  )
}
