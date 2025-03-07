'use client'

import { useEffect, useCallback, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { EditorRoot, EditorContent, JSONContent, EditorInstance } from 'novel'
import { EditorEvents } from '@tiptap/core'
import { handleImageDrop, handleImagePaste } from 'novel/plugins'
import { ImageResizer, handleCommandNavigation } from 'novel/extensions'
import { EditorProps } from '@tiptap/pm/view'

import { InlineToolbar } from './inline-toolbar'
import { slashCommand, SuggestionMenuCommand } from './slash-command'
import { editorExtensions, handleImageUpload } from './node-extensions'
import { defaultEditorContent } from './utils'

const extensions = [...editorExtensions, slashCommand]

export default function EditorWrapper() {
  const [content, setContent] = useState<JSONContent>(defaultEditorContent)

  // useEffect(() => {
  //   const content = window.localStorage.getItem('novel-content')
  //   if (content) {
  //     return setContent(JSON.parse(content))
  //   }

  //   setContent(defaultEditorContent)
  // }, [])

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON()
    window.localStorage.setItem('novel-content', JSON.stringify(json))
  }, 500)

  const onUpdate = useCallback(
    ({ editor }: EditorEvents['update']) => {
      // debouncedUpdates(editor)
      console.log(editor.getJSON(), editor)
    },
    [debouncedUpdates],
  )

  if (!content) return null

  const editorProps: EditorProps = {
    handleDOMEvents: {
      keydown: (_view, event) => handleCommandNavigation(event),
    },
    handlePaste: (view, event) => handleImagePaste(view, event, handleImageUpload),
    handleDrop: (view, event, _slice, moved) =>
      handleImageDrop(view, event, moved, handleImageUpload),
    attributes: {
      class: `prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
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
          onUpdate={onUpdate}
          slotAfter={<ImageResizer />}
        >
          <SuggestionMenuCommand />
          <InlineToolbar />
        </EditorContent>
      </EditorRoot>
    </div>
  )
}
