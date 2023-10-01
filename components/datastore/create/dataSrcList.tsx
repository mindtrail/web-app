import { useMemo, useCallback } from 'react'
// import { Cross1Icon } from '@radix-ui/react-icons'
import { Cross1Icon, FileTextIcon, GlobeIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { StatusIcon } from '@/components/datastore/statusIcon'
import { MAX_NR_OF_FILES } from '@/components/datastore/constants'
import { DataSrcType } from '@prisma/client'

interface DataSrcList {
  type: DataSrcType
  acceptedFiles: AcceptedFile[] | URLScrapped[]
  rejectedFiles: RejectedFile[]
  charCount: number
  charCountLoading: boolean
  handleFileDelete: DeleteHandler
}

export function DataSrcList(props: DataSrcList) {
  const {
    acceptedFiles,
    rejectedFiles,
    charCount,
    charCountLoading,
    handleFileDelete,
  } = props

  const acceptedDataSrcList = useMemo(() => {
    return acceptedFiles.map(({ file, charCount, status }) => (
      <div
        className='flex group cursor-default justify-between items-center rounded-md hover:bg-slate-100'
        key={file.name}
      >
        <div className='flex gap-2 items-center'>
          <StatusIcon size='md' status={status} />
          <FileTextIcon  />
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

  const rejectedDataSrcList = useMemo(() => {
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

      {acceptedDataSrcList.length > 0 && (
        <div className='w-full flex-1 relative flex flex-col gap-2'>
          {acceptedDataSrcList}
        </div>
      )}

      {rejectedDataSrcList.length > 0 && (
        <div className='w-full flex-1 relative flex flex-col gap-2 text-red-800'>
          {rejectedDataSrcList}
        </div>
      )}
    </>
  )
}
