import Link from 'next/link'
import { Table, Row } from '@tanstack/react-table'
import { Link1Icon, ExternalLinkIcon } from '@radix-ui/react-icons'
import { DataSourceType } from '@prisma/client'

import { Checkbox } from '@/components/ui/checkbox'
import { Typography } from '@/components/typography'

import { addHttpsIfMissing, cloudinaryLoader } from '@/lib/utils'
import { COLUMN_LABELS } from '@/lib/constants'

type SavedItemHeaderProps<TData> = {
  table: Table<TData>
}

export function SavedItemHeader<TData>({ table }: SavedItemHeaderProps<TData>) {
  return (
    <div className='flex items-center gap-2 px-2 group/saved-item'>
      <Link1Icon className='group-hover/saved-item:invisible' />
      <Checkbox
        className='absolute hidden group-hover/saved-item:block'
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
      {COLUMN_LABELS.displayName}
    </div>
  )
}

type SavedItemCellProps<TData> = {
  row: Row<TData>
  table: Table<TData>
}

export function SavedItemCell<TData>({ row, table }: SavedItemCellProps<TData>) {
  const { original } = row

  const isRowSelected = row.getIsSelected()
  const isCheckboxVisible = table.getIsSomePageRowsSelected()
  const cellWidth = table.getColumn('displayName')?.getSize() || 200

  const { image = '', title = 'Title', name, displayName, type } = original as HistoryItem

  if (!name) {
    return null
  }

  const ItemText = <Typography className='truncate max-w-full'>{displayName}</Typography>

  return (
    <div className='flex flex-col gap-3 -mt-6'>
      <div className='flex items-center justify-center px-8'>
        <Checkbox
          className={`absolute mt-[2px] bg-white left-2 invisible group-hover/row:visible ${
            (isRowSelected || isCheckboxVisible) && 'visible'
          }`}
          checked={isRowSelected}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />

        {type === DataSourceType.file ? (
          ItemText
        ) : (
          <Link
            target='_blank'
            href={addHttpsIfMissing(name)}
            className={`flex px-2 items-center max-w-full text-center
              hover:underline group/link relative`}
          >
            {ItemText}
            <ExternalLinkIcon
              className={`absolute -right-3 invisible group-hover/link:visible`}
            />
          </Link>
        )}
      </div>

      <div className={`w-full h-32 flex rounded-md group/car relative`}>
        {image ? (
          <img
            src={cloudinaryLoader({ src: image, width: cellWidth - 16 })}
            alt={title as string}
            className='absolute top-0 left-0 rounded-md border shadow-sm object-cover w-full h-full'
          />
        ) : (
          <div className='absolute top-0 left-0 rounded-md border shadow-sm w-48 h-32 bg-gray-100'></div>
        )}
        <div
          className={`rounded-md h-full w-full flex flex-col justify-end py-2 bg-gradient-to-t from-white from-15% invisible group-hover/row:visible z-10`}
        >
          <Typography
            className='line-clamp-2 break-all invisible px-3 group-hover/row:visible rounded-md bottom-0'
            variant='small'
          >
            {title}
          </Typography>
        </div>
      </div>
    </div>
  )
}
