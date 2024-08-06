import { useCallback, ChangeEvent } from 'react'
import { Editor, NodeViewWrapper } from '@tiptap/react'

import { IconSpinner } from '@/components/ui/icons/next-icons'
import { Icon } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Typography } from '@/components/typography'

import { useDropZone, useFileUpload, useUploader } from './hooks'

interface FileUploadUIProps {
  getPos: () => number
  editor: Editor
}

export const FileUploadUIComponent = ({ getPos, editor }: FileUploadUIProps) => {
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

  const { loading, uploadFile } = useUploader({ onUpload })
  const { handleUploadClick, ref } = useFileUpload()
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({
    uploader: uploadFile,
  })

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      e.target.files ? uploadFile(e.target.files[0]) : null,
    [uploadFile],
  )

  const wrapperClass = cn(
    'flex flex-col items-center justify-center px-8 py-8 rounded-lg bg-opacity-80 gap-4',
    draggedInside && 'bg-neutral-100',
  )

  if (loading) {
    return (
      <NodeViewWrapper>
        <div className='flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80'>
          <IconSpinner className='text-neutral-500' />
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper>
      <div
        className={wrapperClass}
        onDrop={onDrop}
        onDragOver={onDragEnter}
        onDragLeave={onDragLeave}
        contentEditable={false}
      >
        <div className='flex flex-col items-center justify-center gap-1'>
          <Icon
            name='CloudUpload'
            className='w-10 h-10 text-black dark:text-white opacity-20'
          />

          <Typography variant='small-semi' className='text-muted-foreground'>
            {draggedInside ? 'Drop File here' : 'Drag and drop File here'}
          </Typography>
        </div>

        {!draggedInside ? <Typography variant='small-strong'>OR</Typography> : null}

        <Button
          disabled={draggedInside}
          onClick={handleUploadClick}
          size='sm'
          className='flex gap-2'
        >
          Browse Files
        </Button>
        <input
          className='w-0 h-0 overflow-hidden opacity-0 absolute'
          ref={ref}
          type='file'
          accept='.jpg,.jpeg,.png,.webp,.gif'
          onChange={onFileChange}
        />
      </div>
    </NodeViewWrapper>
  )
}
