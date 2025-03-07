import { useEffect } from 'react'
import { Table, Row } from '@tanstack/react-table'
import { DotFilledIcon } from '@radix-ui/react-icons'
import { DataSourceType } from '@prisma/client'

import { Typography } from '@/components/typography'
import { Checkbox } from '@/components/ui/checkbox'
// import { IconCollection, IconTag, IconAllData } from '@/components/ui/icons/next-icons'

import { cloudinaryLoader, formatDate } from '@/lib/utils'

const IMG_SIZE = 100
const IMG_STYLE = `w-full h-full rounded-md shadow-sm absolute top-0 left-0`
const SECONDARY_TXT_STYLE = 'text-muted-foreground flex gap-1 items-center'

type ClippingsCellProps<TData> = {
  row: Row<TData>
  table: Table<TData>
}

export function ClippingsCell<TData>({ row, table }: ClippingsCellProps<TData>) {
  const { original, depth } = row
  const isRowSelected =
    depth === 1
      ? row.getIsSelected()
      : row.getIsAllSubRowsSelected() || (row.getIsSomeSelected() && 'indeterminate')

  const isCheckboxVisible =
    depth === 0
      ? table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected()
      : row.getParentRow()?.getIsSomeSelected()

  const {
    createdAt,
    image = '',
    title = 'Title',
    displayName,
    type,
  } = original as HistoryItem

  const fileType = type === DataSourceType.file ? displayName.split('.').pop() : null

  const handleParentCheck = () => {
    const allChildrenSelected = row.getIsAllSubRowsSelected()

    row.subRows.forEach((subRow) => {
      subRow.toggleSelected(!allChildrenSelected)
    })
  }

  // This is a clipping
  if (depth === 1) {
    const { content } = row.original as SavedClipping
    return (
      <div className='ml-16 pl-8 py-2 flex relative items-center'>
        <Typography
          className={`${SECONDARY_TXT_STYLE}
                  line-clamp-2 border-l-2 border-yellow-500 pl-3`}
          variant='small'
        >
          {content}
        </Typography>

        <Checkbox
          className={`absolute left-0 bg-secondary drop-shadow-lg shadow-white/30
              invisible group-hover/row:visible
              ${(isRowSelected || isCheckboxVisible) && 'visible'}
            `}
          checked={isRowSelected}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    )
  }

  return (
    <div className={`flex gap-4 pt-4 pb-2 ${row.id !== '0' && 'border-t'}`}>
      <div className={`flex items-center rounded-md relative w-12 h-12 shrink-0`}>
        <div
          className={`group-hover/row:opacity-50 ${isCheckboxVisible && 'opacity-50'}`}
        >
          {image ? (
            <img
              src={cloudinaryLoader({ src: image, width: IMG_SIZE })}
              alt={title as string}
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
        </div>

        <Checkbox
          className={`absolute top-2 left-2 bg-secondary drop-shadow-lg shadow-white/30
              invisible group-hover/row:visible
              ${(isRowSelected || isCheckboxVisible) && 'visible'}
            `}
          checked={isRowSelected}
          onCheckedChange={handleParentCheck}
          aria-label='Select row'
        />
      </div>

      <div className='flex flex-col flex-1 gap-2 max-w-[calc(100%-64px)]'>
        <Typography className='truncate max-w-full text-foreground/90' variant='text-lg'>
          {title}
        </Typography>

        <div className='flex gap-2 items-center'>
          <Typography
            className={`${SECONDARY_TXT_STYLE} truncate max-w-[30%]`}
            variant='small'
          >
            {displayName}
          </Typography>
          <DotFilledIcon className='w-3 h-3 text-muted-foreground' />
          <Typography className={SECONDARY_TXT_STYLE} variant='small'>
            {formatDate(new Date(createdAt), 'short')}
          </Typography>
        </div>
      </div>
    </div>
  )
}
