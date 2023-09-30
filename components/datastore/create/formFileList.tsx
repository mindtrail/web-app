import { useMemo, useCallback } from 'react'
// import { Cross1Icon } from '@radix-ui/react-icons'
import { Cross1Icon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { StatusIcon } from '@/components/datastore/statusIcon'
import { MAX_NR_OF_FILES } from '@/components/datastore/constants'

interface FormList {
  acceptedFiles: AcceptedFile[]
  rejectedFiles: RejectedFile[]
  charCount: number
  charCountLoading: boolean
  handleFileDelete: DeleteHandler
}

export function FormList(props: FormList) {
  const {
    acceptedFiles,
    rejectedFiles,
    charCount,
    charCountLoading,
    handleFileDelete,
  } = props

  const acceptedFormList = useMemo(() => {
    return acceptedFiles.map(({ file, charCount, status }) => (
      <div
        className='flex group cursor-default justify-between items-center rounded-md hover:bg-slate-100'
        key={file.name}
      >
        <div className='flex gap-2 items-center'>
          <StatusIcon size='md' status={status} />
          {file.name}
        </div>

        <div className='flex gap-2 items-center'>
          <span>{charCount}</span>
          <Button
            variant='ghost'
            size='sm'
            className='invisible group-hover:visible'
            disabled={status !== 'unsynched' && status !== 'synched'}
            onClick={(event) =>
              handleFileDelete(event, { file, charCount, status })
            }
          >
            <Cross1Icon />
          </Button>
        </div>
      </div>
    ))
  }, [acceptedFiles, handleFileDelete])

  const rejectedFormList = useMemo(() => {
    return rejectedFiles.map(({ file }: RejectedFile) => (
      <p key={file.name}>{file.name}</p>
    ))
  }, [rejectedFiles])

  return (
    <>
      <div className='flex justify-between items-center'>
        <span className='text-ellipsis max-w-sm'>
          {`${acceptedFiles.length} of ${MAX_NR_OF_FILES} uploaded`}
        </span>

        <span className='flex items-center'>
          {charCountLoading ? <IconSpinner className='mr-2' /> : charCount}{' '}
          Chars
        </span>
      </div>

      {acceptedFormList.length > 0 && (
        <div className='w-full flex-1 relative flex flex-col gap-2'>
          {acceptedFormList}
        </div>
      )}

      {rejectedFormList.length > 0 && (
        <div className='w-full flex-1 relative flex flex-col gap-2 text-red-800'>
          {rejectedFormList}
        </div>
      )}
    </>
  )
}
