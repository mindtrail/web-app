import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

import { BlockNoteView, useCreateBlockNote } from '@blocknote/react'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/react/style.css'

import { EDITOR_OPTIONS } from './utils'

export default function EditorWrapper() {
  const editor = useCreateBlockNote(EDITOR_OPTIONS)
  const { theme } = useTheme()

  const editorTheme = useMemo(() => {
    switch (theme) {
      case 'dark':
        return 'dark'
      case 'light':
        return 'light'
      default: // for system theme, we don't set anything
        return
    }
  }, [theme])

  return <BlockNoteView editor={editor} theme={editorTheme} />
}
