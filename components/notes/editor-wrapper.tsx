'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useDebouncedCallback } from 'use-debounce'

import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
} from 'novel'

import { ImageResizer, handleCommandNavigation } from 'novel/extensions'

import { Separator } from '@/components/ui/separator'
import { defaultValue } from './utils'

export default function EditorWrapper() {
  const { theme } = useTheme()

  const [content, setContent] = useState<JSONContent>(defaultValue)
  const [saveStatus, setSaveStatus] = useState('Unsaved')

  console.log(content)

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
    const json = editor.getJSON()
    setContent(json)
    setSaveStatus('Saved')
  }, 500)

  return (
    <EditorRoot>
      {/* @ts-ignore */}
      <EditorContent initialContent={content}>
        {/* <EditorCommand>
          <EditorCommandItem onCommand={() => {}} />
        </EditorCommand>
        <EditorBubble>
          <EditorBubbleItem> 1234</EditorBubbleItem>
        </EditorBubble> */}
      </EditorContent>
    </EditorRoot>
  )
}
