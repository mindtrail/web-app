import { useEffect, useRef, useState, memo } from 'react'
import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs' // @ts-ignore
import Header from '@editorjs/header' // @ts-ignore
import Link from '@editorjs/link' // @ts-ignore
import List from '@editorjs/list' // @ts-ignore

import { EDITORJS_CONFIG } from './utils'

function EditorWrapper() {
  const editorRef = useRef<EditorJS | null>(null)
  const [editorInstance, setEditor] = useState(null)

  useEffect(() => {
    if (!editorRef?.current) {
      initEditor()
    }

    function initEditor() {
      const editor = new EditorJS({
        ...EDITORJS_CONFIG,
        holder: 'editor-wrapper',
        onReady: () => {
          console.log(editor)
        },
        onChange: async () => {
          let content = await editor.saver.save()
          console.log(content)
        },
      })
      editorRef.current = editor
    }

    return () => {
      if (editorRef?.current && editorRef?.current?.destroy) {
        editorRef.current.destroy()
      }
    }
  }, [])

  return <div id='editor-wrapper' className='h-full' />
}

export default EditorWrapper
