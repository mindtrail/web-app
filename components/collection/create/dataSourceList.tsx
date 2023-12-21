import { useMemo } from 'react'
import { Cross1Icon, FileTextIcon, GlobeIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons/next-icons'
import { MAX_NR_OF_FILES } from '@/components/collection/constants'
import { DataSourceStatus, DataSourceType } from '@prisma/client'
import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const colorMap = {
  [DataSourceStatus.unsynched]: 'text-grey-500',
  [DataSourceStatus.synched]: 'text-green-500',
  [DataSourceStatus.error]: 'text-red-500',
  [DataSourceStatus.running]: 'text-yellow-500',
  [DataSourceStatus.pending]: 'text-gray-900',
  [DataSourceStatus.usage_limit_reached]: 'text-gray-800',
}

interface DataSourceList {
  type: DataSourceType
  acceptedItems: AcceptedFile[] | URLScrapped[]
  rejectedItems?: RejectedFile[]
  textSize: number
  textSizeLoading: boolean
  handleFileDelete: DeleteHandler
}

export function DataSourceList(props: DataSourceList) {
  const {
    type,
    acceptedItems,
    rejectedItems = [],
    textSize,
    textSizeLoading,
    handleFileDelete,
  } = props

  const IconElement =
    type === DataSourceType.web_page ? GlobeIcon : FileTextIcon

  // @TODO: update the name of the file in the DataSource to don't need the regex
  const acceptedDataSourceList = useMemo(() => {
    acceptedItems.sort((a, b) => (a?.file?.name < b?.file?.name ? 1 : -1))

    return acceptedItems.map(
      ({ file, textSize, status = 'unsynched' }, index) => (
        <div
          className='flex group cursor-default justify-between items-center rounded-md hover:bg-slate-100 '
          key={index}
        >
          <Tooltip>
            <TooltipTrigger onClick={(e) => e.preventDefault()}>
              <div className='flex gap-2 items-center cursor-default'>
                <IconElement className={`${colorMap[status]}`} />
                <p className='whitespace-nowrap text-ellipsis overflow-hidden max-w-[60%] sm:max-w-sm'>
                  {file.name}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent
              className={
                status !== DataSourceStatus.synched ? 'bg-gray-500' : ''
              }
            >
              {status}
            </TooltipContent>
          </Tooltip>

          <div className='flex gap-2 items-center shrink-0'>
            <span>{textSize}</span>
            <Button
              variant='ghost'
              size='sm'
              className='invisible group-hover:visible'
              disabled={status !== 'unsynched' && status !== 'synched'}
              onClick={(event) =>
                // @ts-ignore
                handleFileDelete(event, { file, textSize, status })
              }
            >
              <Cross1Icon />
            </Button>
          </div>
        </div>
      ),
    )
  }, [acceptedItems, handleFileDelete, IconElement])

  const rejectedDataSourceList = useMemo(() => {
    return rejectedItems.map(({ file }: RejectedFile, index) => (
      <p key={index}>{file.name}</p>
    ))
  }, [rejectedItems])

  return (
    <>
      {type === DataSourceType.file && (
        <div className='flex justify-between items-center'>
          <span className='text-ellipsis max-w-sm'>
            {`${acceptedItems.length} of ${MAX_NR_OF_FILES} uploaded`}
          </span>

          <span className='flex items-center gap-3'>
            <span>
              {textSizeLoading ? <IconSpinner className='mr-2' /> : textSize}
            </span>
            <span>Chars</span>
          </span>
        </div>
      )}

      {acceptedDataSourceList.length > 0 && (
        <ScrollArea className='w-full flex-1 relative flex flex-col gap-1 max-h-[50vh] rounded-md border py-4 px-2'>
          {acceptedDataSourceList}
        </ScrollArea>
      )}

      {rejectedDataSourceList.length > 0 && (
        <div className='w-full flex-1 relative flex flex-col gap-1 text-red-800'>
          {rejectedDataSourceList}
        </div>
      )}
    </>
  )
}
