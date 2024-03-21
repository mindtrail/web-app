import { useEffect, useRef, useState, memo } from 'react'
import EditorJS from '@editorjs/editorjs' // @ts-ignore
// import Undo from 'editorjs-undo'
import DragDrop from 'editorjs-drag-drop'

import { EDITORJS_CONFIG } from './utils'

function EditorWrapper() {
  const editorRef = useRef<EditorJS | null>(null)
  const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null)

  // initialize
  useEffect(() => {
    const editor = new EditorJS({
      ...EDITORJS_CONFIG,
      holder: 'editor-wrapper',
      onReady: async () => {
        // console.log(editorRef.current)
        setTimeout(() => {
          setEditorInstance(editor)
        }, 300)
      },
      onChange: async (editor) => {
        // let content = await editor.saver.save()
        // console.log(content)
      },
    })

    return () => {
      if (!editor) {
        setEditorInstance(null)
        return
      }
      editor.isReady
        .then(() => {
          editor.destroy()
          setEditorInstance(null)
        })
        .catch((e) => console.error('ERROR editor cleanup', e))
    }
  }, [])

  // set reference
  useEffect(() => {
    if (!editorInstance) {
      return
    }
    console.log(editorInstance)
    // Send instance to the parent
    // if (editorRef) {
    // }
  }, [editorInstance])

  return <div id='editor-wrapper' className='h-full' />
}

export default EditorWrapper
