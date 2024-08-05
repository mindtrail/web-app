import { Editor, NodeViewWrapper } from '@tiptap/react'
import { useCallback } from 'react'

import { ImageUploader } from './ImageUploader'

interface ImageUploadComponentProps {
  getPos: () => number
  editor: Editor
}

export const ImageUploadComponent = ({ getPos, editor }: ImageUploadComponentProps) => {
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
        <ImageUploader onUpload={onUpload} />
      </div>
    </NodeViewWrapper>
  )
}
