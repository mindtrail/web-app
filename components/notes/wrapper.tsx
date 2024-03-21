import { useEffect, useRef, useState, memo } from 'react'
import EditorJS from '@editorjs/editorjs' // @ts-ignore

import { EDITORJS_CONFIG } from './utils'

function EditorWrapper() {
  const editorRef = useRef<EditorJS | null>(null)
  const [editorInstance, setEditor] = useState<EditorJS | null>(null)

  // initialize
  useEffect(() => {
    const editor = new EditorJS({
      ...EDITORJS_CONFIG,
      holder: 'editor-wrapper',
      onChange: async (api) => {
        let content = await api.saver.save()
        console.log(content)
        console.log(api.selection)
        // api.blocks.
      },
    })
    setEditor(editor)
    // editor.

    return () => {
      editor.isReady
        .then(() => {
          editor.destroy()
          setEditor(null)
        })
        .catch((e) => console.error('ERROR editor cleanup', e))
    }
  }, [])

  // set reference
  useEffect(() => {
    if (!editorInstance) {
      return
    }
    // Send instance to the parent
    if (editorRef) {
      editorRef.current = editorInstance
    }
  }, [editorInstance, editorRef])

  return <div id='editor-wrapper' className='h-full' />
}

export default EditorWrapper
