import { Node } from '@tiptap/pm/model'
import { NodeViewWrapper } from '@tiptap/react'

interface FileViewerUIComponentProps {
  node: Node & {
    attrs: {
      src: string
      filename: string
      fileType: string
      isImage: boolean
    }
  }
}

export const FileViewerUIComponent = ({ node }: FileViewerUIComponentProps) => {
  const { src, filename, fileType, isImage } = node.attrs

  return (
    <NodeViewWrapper>
      {isImage ? (
        <img src={src} alt={filename} className='max-w-full h-auto' />
      ) : (
        <div className='flex items-center p-4 bg-gray-100 rounded'>
          <div className='mr-4'>
            {/* You can add file type icons here based on fileType */}
            📄
          </div>
          <div>
            <div className='font-bold'>{filename}</div>
            <div className='text-sm text-gray-500'>{fileType}</div>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}
