import { Editor, NodeViewWrapper } from '@tiptap/react'
import { useCallback } from 'react'

import { UploadArea } from './upload-area'

interface FileUploadComponentProps {
  getPos: () => number
  editor: Editor
}

export const FileUploadComponent = ({ getPos, editor }: FileUploadComponentProps) => {
  const onUpload = useCallback(
    (url: string) => {
      if (url) {
        editor
          .chain()
          .setImageViewer({ src: url })
          .deleteRange({ from: getPos(), to: getPos() })
          .focus()
          .run()
      }
    },
    [getPos, editor],
  )

  return (
    <NodeViewWrapper>
      <div className='p-0 m-0' data-drag-handle>
        <UploadArea onUpload={onUpload} />
      </div>
    </NodeViewWrapper>
  )
}
