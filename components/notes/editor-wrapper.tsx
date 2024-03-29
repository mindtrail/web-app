'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useDebouncedCallback } from 'use-debounce'

import {
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandItem,
  EditorContent,
  EditorRoot,
  JSONContent,
  EditorInstance,
} from 'novel'

import { Separator } from '@/components/ui/separator'
import { DEFAULT_EDITOR_OPTIONS } from './utils'

export default function EditorWrapper() {
  const { theme } = useTheme()

  const [content, setContent] = useState<JSONContent | undefined>()
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
      <EditorContent>
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
