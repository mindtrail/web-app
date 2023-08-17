import { useMemo, useCallback } from 'react'
import { Cross1Icon } from '@radix-ui/react-icons'
import { DataSourceStatus } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { StatusIcon } from '@/components/datastore/statusIcon'
import { MAX_NR_OF_FILES } from '@/components/datastore/constants'

interface FormList {
  acceptedFiles: AcceptedFile[]
  rejectedFiles: RejectedFile[]
  charCount: number
  charCountLoading: boolean
  handleFileDeleteFromUI: (file: AcceptedFile) => void
}

type DeleteHandler = (event: React.MouseEvent<HTMLButtonElement>, file: AcceptedFile) => void

export function FormList(props: FormList) {
  const { acceptedFiles, rejectedFiles, charCount, charCountLoading, handleFileDeleteFromUI } =
    props

  const handleDelete: DeleteHandler = useCallback((event, file) => {
    console.log(event)
    event.preventDefault()

    const { status } = file

    if (status === DataSourceStatus.synched) {
      // Popup modal
      console.log('popup modal')
    }

    if (status === DataSourceStatus.unsynched) {
      handleFileDeleteFromUI(file)
    }
  }, [])

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
            onClick={(event) => handleDelete(event, { file, charCount, status })}
          >
            <Cross1Icon />
          </Button>
        </div>
      </div>
    ))
  }, [acceptedFiles, handleDelete])

  const rejectedFormList = useMemo(() => {
    return rejectedFiles.map(({ file }: RejectedFile) => <p key={file.name}>{file.name}</p>)
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
