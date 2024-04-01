import { useEffect, useRef, useState, memo } from 'react'
import EditorJS from '@editorjs/editorjs' // @ts-ignore
// import Undo from 'editorjs-undo'
import DragDrop from 'editorjs-drag-drop'

import { EDITORJS_CONFIG } from './utils'

let count = 0
let editor: EditorJS | null = null

function EditorWrapper() {
  const editorRef = useRef<EditorJS | null>(null)
  const [editorInstance, setEditorInstance] = useState<EditorJS | null>(null)

  // initialize
  useEffect(() => {
    if (editor) {
      return
    }

    editor = new EditorJS({
      ...EDITORJS_CONFIG,
      holder: 'editor-wrapper',
      onReady: async () => {
        ++count
        new DragDrop(editor)
        // setEditorInstance(editor)
      },
      onChange: async (editor) => {
        // let content = await editor.saver.save()
        // console.log(content)
      },
    })
    editorRef.current = editor

    // cleanup
    return () => {
      if (!editor) {
        return
      }

      console.log(count, editor)
      editor.isReady
        .then(() => {
          // editor?.destroy()
        })
        .catch((e) => console.error('ERROR editor cleanup', e))
    }
  }, [])

  // set reference
  useEffect(() => {
    // if (!editorInstance) {
    // return
    // }
  }, [editorInstance])

  return <div id='editor-wrapper' className='h-full' />
}

export default EditorWrapper
