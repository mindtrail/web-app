import { useMemo } from 'react'
// import { Cross1Icon } from '@radix-ui/react-icons'
import { Cross1Icon, FileTextIcon, GlobeIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { MAX_NR_OF_FILES } from '@/components/datastore/constants'
import { DataSrcStatus, DataSrcType } from '@prisma/client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const colorMap = {
  [DataSrcStatus.unsynched]: 'grey-500',
  [DataSrcStatus.synched]: 'green-500',
  [DataSrcStatus.error]: 'red-500',
  [DataSrcStatus.running]: 'yellow-500',
  [DataSrcStatus.pending]: 'gray-900',
  [DataSrcStatus.usage_limit_reached]: 'gray-800',
}

interface DataSrcList {
  type: DataSrcType
  acceptedItems: AcceptedFile[] | URLScrapped[]
  rejectedItems?: RejectedFile[]
  charCount: number
  charCountLoading: boolean
  handleFileDelete: DeleteHandler
}

const WEB_PAGE_REGEX = /(?:[^\/]+\/){2}(.+)/

export function DataSrcList(props: DataSrcList) {
  const {
    type,
    acceptedItems,
    rejectedItems = [],
    charCount,
    charCountLoading,
    handleFileDelete,
  } = props

  const IconElement = type === DataSrcType.web_page ? GlobeIcon : FileTextIcon

  const getName = (name: string) => {
    if (type === DataSrcType.web_page) {
      const match = name.match(WEB_PAGE_REGEX)
      return match ? match[1] : name
    }

    return name
  }

  const acceptedDataSrcList = useMemo(() => {
    return acceptedItems.map(({ file, charCount, status = 'unsynched' }) => (
      <div
        className='flex group cursor-default justify-between items-center rounded-md hover:bg-slate-100'
        key={file.name}
      >
        <div className='flex gap-2 items-center'>
          <Tooltip>
            <TooltipTrigger>
              <IconElement className={`text-${colorMap[status]}`} />
              <p className='whitespace-nowrap text-ellipsis overflow-hidden max-w-[125px]'></p>
            </TooltipTrigger>
            <TooltipContent
              className={status !== DataSrcStatus.synched ? 'bg-gray-500' : ''}
            >
              {status}
            </TooltipContent>
          </Tooltip>
          {getName(file.name)}
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
  }, [acceptedItems, handleFileDelete, IconElement, getName])

  const rejectedDataSrcList = useMemo(() => {
    return rejectedItems.map(({ file }: RejectedFile) => (
      <p key={file.name}>{file.name}</p>
    ))
  }, [rejectedItems])

  return (
    <>
      {type === DataSrcType.file && (
        <div className='flex justify-between items-center'>
          <span className='text-ellipsis max-w-sm'>
            {`${acceptedItems.length} of ${MAX_NR_OF_FILES} uploaded`}
          </span>

          <span className='flex items-center'>
            {charCountLoading ? <IconSpinner className='mr-2' /> : charCount}{' '}
            Chars
          </span>
        </div>
      )}

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
