import { useMemo } from 'react'
import { FileRejection } from 'react-dropzone'
import { Cross1Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { StatusIcon } from '@/components/datastore/statusIcon'
import { MAX_NR_OF_FILES } from '@/components/datastore/constants'

interface FormList {
  acceptedFiles: AcceptedFile[]
  rejectedFiles: FileRejection[]
  charCount: number
  charCountLoading: boolean
  handleDelete: (file: AcceptedFile) => void
}

export function FormList(props: FormList) {
  const { acceptedFiles, rejectedFiles, charCount, charCountLoading, handleDelete } = props

  const acceptedFormList = useMemo(() => {
    return acceptedFiles.map(({ file, charCount }) => (
      <div
        className='flex group cursor-default justify-between items-center hover:bg-slate-100'
        key={file.name}
      >
        <StatusIcon />
        {file.name}

        <div className='flex gap-2 items-center'>
          <span>{charCount}</span>
          <Button
            variant='ghost'
            size='sm'
            className='invisible group-hover:visible'
            onClick={() => {
              handleDelete({ file, charCount })
            }}
          >
            <Cross1Icon />
          </Button>
        </div>
      </div>
    ))
  }, [acceptedFiles, handleDelete])

  const rejectedFormList = useMemo(() => {
    return rejectedFiles.map(({ file }: FileRejection) => <p key={file.name}>{file.name}</p>)
  }, [rejectedFiles])

  return (
    <>
      <div className='flex justify-between items-center'>
        <span className='text-ellipsis max-w-sm'>
          {`${acceptedFiles.length} of ${MAX_NR_OF_FILES} uploaded`}
        </span>

        <span className='flex items-center'>
          {charCountLoading ? <IconSpinner className='mr-2' /> : charCount} Chars
        </span>
      </div>

      {acceptedFormList.length > 0 && (
        <div className='max-w-lg w-full flex-1 relative flex flex-col gap-2'>
          {acceptedFormList}
        </div>
      )}

      {rejectedFormList.length > 0 && (
        <div className='max-w-lg w-full flex-1 relative flex flex-col gap-2 text-red-800'>
          {rejectedFormList}
        </div>
      )}
    </>
  )
}
