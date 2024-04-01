import { useCallback, useState, useEffect } from 'react'

import EditorJS, { OutputData } from '@editorjs/editorjs' // @ts-ignore

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

export const dataKey = 'editorData'

export const useSaveCallback = (editor: EditorJS) => {
  return useCallback(async () => {
    if (!editor) return
    try {
      const out = await editor.save()
      console.group('EDITOR onSave')
      console.dir(out)
      localStorage.setItem(dataKey, JSON.stringify(out))
      console.info('Saved in localStorage')
      console.groupEnd()
    } catch (e) {
      console.error('SAVE RESULT failed', e)
    }
  }, [editor])
}

// Set editor data after initializing
export const useSetData = (editor: EditorJS, data: OutputData) => {
  useEffect(() => {
    if (!editor || !data) {
      return
    }

    editor.isReady.then(() => {
      // fixing an annoying warning in Chrome `addRange(): The given range isn't in document.`
      setTimeout(() => {
        editor.render(data)
      }, 100)
    })
  }, [editor, data])
}

export const useClearDataCallback = (editor: EditorJS) => {
  return useCallback(
    (ev: any) => {
      ev.preventDefault()
      if (!editor) {
        return
      }
      editor.isReady.then(() => {
        // fixing an annoying warning in Chrome `addRange(): The given range isn't in document.`
        setTimeout(() => {
          editor.clear()
        }, 100)
      })
    },
    [editor],
  )
}

// load saved data
export const useLoadData = () => {
  const [data, setData] = useState<OutputData | null>(null)
  const [loading, setLoading] = useState(false)

  // Mimic async data load
  useEffect(() => {
    setLoading(true)
    const id = setTimeout(() => {
      console.group('EDITOR load data')
      const saved = localStorage.getItem(dataKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        setData(parsed)
        console.dir(parsed)
      } else {
        console.info('No saved data, using initial')
        console.dir(DEFAULT_INITIAL_DATA)
        setData(DEFAULT_INITIAL_DATA)
      }
      console.groupEnd()
      setLoading(false)
    }, 200)

    return () => {
      setLoading(false)
      clearTimeout(id)
    }
  }, [])

  return { data, loading }
}
