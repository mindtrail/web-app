import { useEffect, useRef, memo } from 'react'
import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs' // @ts-ignore
import Header from '@editorjs/header' // @ts-ignore
import Link from '@editorjs/link' // @ts-ignore
import List from '@editorjs/list' // @ts-ignore

import { EDITORJS_TOOLS } from './tools'

const DEFAULT_INITIAL_DATA: OutputData = {
  time: new Date().getTime(),
  blocks: [
    {
      type: 'header',
      data: {
        text: 'This is my awesome editor!',
        level: 1,
      },
    },
  ],
}

const EDITOR_CONFIG: EditorConfig = {
  holder: 'editor-wrapper',
  autofocus: true,
  data: DEFAULT_INITIAL_DATA,
  tools: EDITORJS_TOOLS,
}

function EditorWrapper() {
  const editorRef = useRef<EditorJS | null>(null)

  useEffect(() => {
    if (!editorRef?.current) {
      initEditor()
    }

    function initEditor() {
      const editor = new EditorJS({
        ...EDITOR_CONFIG,
        onReady: () => {
          editorRef.current = editor
        },
        onChange: async () => {
          let content = await editor.saver.save()

          console.log(content)
        },
      })
    }

    return () => {
      editorRef?.current?.destroy()
      editorRef.current = null
    }
  }, [])

  return <div id='editor-wrapper' />
}

export default memo(EditorWrapper)
