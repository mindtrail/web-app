import { useEffect, useRef, useState } from 'react'
import EditorJS, { EditorConfig } from '@editorjs/editorjs'
// @ts-ignore
import DragDrop from 'editorjs-drag-drop'
import { EDITORJS_CONFIG } from './utils'

let instanceNr = 0

function EditorWrapper() {
  const editorRef = useRef<EditorJS | null>(null)
  const [val, setValue] = useState('')

  console.log(1232114)
  useEffect(() => {
    // Because of react strict mode, the component loads twice, and destroys the editor
    // on first cleanup. So we skip the initialization in this case.
    if (process.env.NODE_ENV === 'development' && instanceNr === 0) {
      instanceNr++
      return
    }

    const EditorOpts: EditorConfig = {
      ...EDITORJS_CONFIG,
      holder: 'editor-wrapper',
      onReady: async () => {
        // new DragDrop(editor)
        // setEditorInstance(editor)
      },
      onChange: async (api) => {
        // Handle change if needed
        console.log(await api.saver.save())
      },
    }

    editorRef.current = new EditorJS(EditorOpts)

    return () => {
      if (editorRef.current) {
        try {
          editorRef.current?.destroy()
        } catch (e) {
          console.error(e)
        } finally {
          console.log(333)
          // reset the count and ref
          instanceNr = 0
          editorRef.current = null
        }
      }
    }
  }, [])

  return <div id='editor-wrapper' className='h-full' />
}

export default EditorWrapper
