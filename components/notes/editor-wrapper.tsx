'use client'

import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { EditorRoot, EditorContent, type JSONContent, EditorInstance } from 'novel'
import { handleImageDrop, handleImagePaste } from 'novel/plugins'
import { ImageResizer, handleCommandNavigation } from 'novel/extensions'
import { EditorProps } from '@tiptap/pm/view'

import { Separator } from '@/components/ui/separator'

import { NodeSelector } from './selectors/node-selector'
import { LinkSelector } from './selectors/link-selector'
import { ColorSelector } from './selectors/color-selector'
import { TextButtons } from './selectors/text-buttons'
import { GenerativeMenuSwitch } from './generative/generative-menu-switch'

import { defaultEditorContent } from './utils'
import { defaultExtensions } from './extensions'
import { slashCommand, SuggestionMenuCommand } from './slash-command'
import { uploadFn } from './image-upload'

const extensions = [...defaultExtensions, slashCommand]

export default function EditorWrapper() {
  const [content, setContent] = useState<JSONContent>(defaultEditorContent)

  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openAI, setOpenAI] = useState(false)

  // console.log(content)

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON()
    window.localStorage.setItem('novel-content', JSON.stringify(json))
  }, 500)

  useEffect(() => {
    const content = window.localStorage.getItem('novel-content')

    if (content) {
      setContent(JSON.parse(content))
    } else {
      setContent(defaultEditorContent)
    }
  }, [])

  if (!content) return null

  const editorProps: EditorProps = {
    handleDOMEvents: {
      keydown: (_view, event) => handleCommandNavigation(event),
    },
    handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
    handleDrop: (view, event, _slice, moved) =>
      handleImageDrop(view, event, moved, uploadFn),
    attributes: {
      class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
    },
  }

  return (
    <div className='relative w-full max-w-screen-lg'>
      <EditorRoot>
        <EditorContent
          className='relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background
            sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg'
          initialContent={content}
          extensions={extensions}
          editorProps={editorProps}
          onUpdate={({ editor }) => debouncedUpdates(editor)}
          slotAfter={<ImageResizer />}
        >
          <SuggestionMenuCommand />
          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation='vertical' />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation='vertical' />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation='vertical' />
            <TextButtons />
            <Separator orientation='vertical' />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  )
}
