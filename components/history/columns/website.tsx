import Link from 'next/link'
import { Table, Row } from '@tanstack/react-table'
import { Link1Icon, ExternalLinkIcon } from '@radix-ui/react-icons'

import { Checkbox } from '@/components/ui/checkbox'
import { Typography } from '@/components/typography'

import { addHttpsIfMissing, cloudinaryLoader } from '@/lib/utils'

type WebsiteHeaderProps = {
  table: Table<HistoryItem>
}

export const WebsiteHeader = ({ table }: WebsiteHeaderProps) => {
  return (
    <div className='flex items-center gap-2 px-2 group/website'>
      <Link1Icon className='group-hover/website:invisible' />
      <Checkbox
        className='absolute hidden group-hover/website:block'
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
      Website
    </div>
  )
}

type WebsiteCellProps = {
  row: Row<HistoryItem>
  table: Table<HistoryItem>
}

export const WebsiteCell = ({ row, table }: WebsiteCellProps) => {
  const { original } = row

  const isRowSelected = row.getIsSelected()
  const isCheckboxVisible = table.getIsSomePageRowsSelected()
  const cellWidth = table.getColumn('website')?.getSize() || 200

  const {
    image = '',
    title = 'Title',
    updatedAt,
    name,
    displayName,
  } = original as HistoryItem

  const updatedDate = new Date(updatedAt).toDateString()

  if (!name) {
    return null
  }

  return (
    <div className='flex flex-col items-center gap-3 relative -mt-6'>
      <Link
        className={`flex justify-center items-center relative group/website px-4
              hover:underline`}
        href={addHttpsIfMissing(name)}
        target='_blank'
      >
        <Typography className='line-clamp-1 text-center'>
          {displayName}
        </Typography>
        <ExternalLinkIcon
          className={`absolute -right-1 invisible group-hover/website:visible`}
        />
      </Link>
      <Checkbox
        className={`absolute mt-[2px] left-2 invisible group-hover/row:visible ${
          (isRowSelected || isCheckboxVisible) && 'visible'
        }`}
        checked={isRowSelected}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
      <div className={`w-full h-32 flex rounded-md group/car relative`}>
        {image ? (
          <img
            src={cloudinaryLoader({ src: image, width: cellWidth })}
            alt={title as string}
            className='absolute top-0 left-0 rounded-md border shadow-sm object-cover w-full h-full'
          />
        ) : (
          <div className='absolute top-0 left-0 rounded-md border shadow-sm w-48 h-32 bg-gray-100'></div>
        )}
        <div
          className={`rounded-md h-full flex flex-col justify-end py-2 bg-gradient-to-t from-white from-15% invisible group-hover/row:visible z-10`}
        >
          <Typography
            className='line-clamp-2 invisible px-3 group-hover/row:visible rounded-md bottom-0'
            variant='small'
          >
            {title}
          </Typography>
        </div>
      </div>
    </div>
  )
}
