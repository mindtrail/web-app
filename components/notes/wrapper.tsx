import { useEffect, useRef, useState } from 'react'

import { BlockNoteView, useCreateBlockNote } from '@blocknote/react'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/react/style.css'

export default function EditorWrapper() {
  const editor = useCreateBlockNote()

  return <BlockNoteView editor={editor} theme={'light'} />
}
