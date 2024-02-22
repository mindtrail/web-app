import Link from 'next/link'
import { Table, Row } from '@tanstack/react-table'
import { ExternalLinkIcon } from '@radix-ui/react-icons'
import { DataSourceType } from '@prisma/client'

import { Checkbox } from '@/components/ui/checkbox'
import { Typography } from '@/components/typography'

import { addHttpsIfMissing, cloudinaryLoader } from '@/lib/utils'

const DEFAULT_IMG_SIZE = 250
const IMG_STYLE = 'h-full w-full rounded-md border shadow-sm absolute top-0 left-0'

type HighlightsCellProps<TData> = {
  row: Row<TData>
  table: Table<TData>
}

export function HighlightsCell<TData>({ row, table }: HighlightsCellProps<TData>) {
  const { original } = row

  const isRowSelected = row.getIsSelected()
  const isCheckboxVisible = table.getIsSomePageRowsSelected()
  const cellWidth = table.getColumn('displayName')?.getSize() || 200

  // Only use 2 image sizes. Good enough resolution to work with.
  const imageSize =
    cellWidth > DEFAULT_IMG_SIZE * 2 ? DEFAULT_IMG_SIZE * 2 : DEFAULT_IMG_SIZE

  const { image = '', title = 'Title', name, displayName, type } = original as HistoryItem

  const fileType = type === DataSourceType.file ? displayName.split('.').pop() : null

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

      <div className={`flex h-32 rounded-md group/car relative`}>
        {image ? (
          <img
            src={cloudinaryLoader({ src: image, width: imageSize })}
            alt={title as string}
            className={`${IMG_STYLE} object-cover`}
          />
        ) : (
          <div className={`${IMG_STYLE} flex items-center justify-center bg-gray-100`}>
            <Typography
              variant='h3'
              className='line-clamp-2 break-all text-foreground/25'
            >
              {fileType}
            </Typography>
          </div>
        )}
        <div
          className={`rounded-md h-full w-full flex flex-col justify-end py-2
            bg-gradient-to-t from-white from-15% invisible group-hover/row:visible z-10`}
        >
          <Typography
            className='line-clamp-2 break-all invisible px-4 group-hover/row:visible'
            variant='small'
          >
            {title}
          </Typography>
        </div>
      </div>
    </div>
  )
}
