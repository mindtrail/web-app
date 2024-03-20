import { useEffect, useRef } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import Link from '@editorjs/link'
import List from '@editorjs/list'

const DEFAULT_INITIAL_DATA = {
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

const EDITOR_CONFIG = {
  holder: 'editor-wrapper',
  autofocus: true,
  data: DEFAULT_INITIAL_DATA,
  tools: {
    header: Header,
    link: Link,
    list: List,
  },
}

export default function EditorWrapper() {
  const editorRef = useRef<EditorJS | null>(null)

  const initEditor = () => {
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

  useEffect(() => {
    if (!editorRef?.current) {
      initEditor()
    }

    return () => {
      editorRef?.current?.destroy()
      editorRef.current = null
    }
  }, [])

  return <div id='editor-wrapper' />
}
