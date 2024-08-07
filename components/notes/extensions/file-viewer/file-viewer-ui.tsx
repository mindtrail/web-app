import { Node } from '@tiptap/pm/model'
import { NodeViewWrapper } from '@tiptap/react'

import { Icon } from '@/components/ui/icons'

interface FileViewerUIProps {
  node: Node & {
    attrs: {
      src: string
      fileName: string
      fileType: string
    }
  }
}

export const FileViewerUIComponent = ({ node }: FileViewerUIProps) => {
  const { src, fileName, fileType } = node.attrs

  return (
    <NodeViewWrapper>
      <div className='flex items-center p-4 gap-4 bg-gray-100 rounded select-none'>
        {/* You can add file type icons here based on fileType */}
        <Icon name='FileText' className='w-8 h-8' />
        <div>
          <div className='font-bold'>{fileName}</div>
          <div className='text-sm text-gray-500'>{fileType}</div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}
