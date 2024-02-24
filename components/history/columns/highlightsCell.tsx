import Link from 'next/link'
import { Table, Row } from '@tanstack/react-table'
import { DataSourceType } from '@prisma/client'

import { Typography } from '@/components/typography'
import { Checkbox } from '@/components/ui/checkbox'

import { addHttpsIfMissing, cloudinaryLoader, formatDate } from '@/lib/utils'

const IMG_SIZE = 100
const IMG_STYLE = `w-full h-full rounded-md shadow-sm absolute top-0 left-0`
const SECONDARY_TXT_STYLE = 'text-muted-foreground flex gap-1 items-center'

type HighlightsCellProps<TData> = {
  row: Row<TData>
  table: Table<TData>
}

export function HighlightsCell<TData>({ row, table }: HighlightsCellProps<TData>) {
  const { original, depth } = row
  const isRowSelected = row.getIsSelected()
  const isCheckboxVisible = table.getIsSomePageRowsSelected()

  const {
    clippings = [],
    image = '',
    title = 'Title',
    name,
    displayName,
    type,
  } = original as HistoryItem

  const fileType = type === DataSourceType.file ? displayName.split('.').pop() : null

  // This is a clipping
  if (depth === 1) {
    const { content } = row.original as SavedClipping
    return (
      <div className='flex gap-4 md:gap-6 py-2'>
        <div className='tags flex flex-col gap-2 mt-1 '>
          <Typography
            className={`${SECONDARY_TXT_STYLE}
                  line-clamp-2 border-l border-yellow-500 pl-2`}
            variant='small'
          >
            {content}
          </Typography>
        </div>
      </div>
    )
  }

  if (!name) {
    return null
  }

  return (
    <div className='flex gap-4 md:gap-6 py-2'>
      <div className={`flex rounded-md relative w-[100px] shrink-0`}>
        {image ? (
          <img
            src={cloudinaryLoader({ src: image, width: IMG_SIZE * 2 })}
            alt={title as string}
            style={{ height: `80px`, width: `${IMG_SIZE}px` }}
            className={`${IMG_STYLE} object-cover object-left-top`}
          />
        ) : (
          <div
            className={`${IMG_STYLE} flex items-center justify-center border bg-secondary`}
          >
            <Typography
              variant='h3'
              className='line-clamp-2 break-all text-foreground/25'
            >
              {fileType}
            </Typography>
          </div>
        )}
        <div
          className={`rounded-md w-full h-full flex flex-col justify-end py-2
            bg-gradient-to-br from-secondary/15 from-5% invisible group-hover/row:visible z-10`}
        >
          <Checkbox
            className={`absolute top-2 left-2 bg-secondary drop-shadow-lg shadow-white/30
              invisible group-hover/row:visible
              ${(isRowSelected || isCheckboxVisible) && 'visible'}
            `}
            checked={isRowSelected}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        </div>
      </div>
      <div className='flex flex-col flex-1 gap-2 max-w-[calc(100%-120px)]'>
        <Typography className='truncate max-w-full text-foreground/90' variant='text-lg'>
          {title}
        </Typography>

        {clippings?.length && (
          <div className='tags flex flex-col gap-2 mt-1 '>
            {clippings?.map(({ content }, index) => (
              <Typography
                key={index}
                className={`${SECONDARY_TXT_STYLE}
                  line-clamp-2 border-l border-yellow-500 pl-2`}
                variant='small'
              >
                {content}
              </Typography>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
