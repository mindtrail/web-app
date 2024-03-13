import Link from 'next/link'
import { Table, Row } from '@tanstack/react-table'
import { ExternalLinkIcon } from '@radix-ui/react-icons'
import { DataSourceType } from '@prisma/client'

import { CheckboxLarge } from '@/components/ui/checkbox-large'
import { Typography } from '@/components/typography'

import { addHttpsIfMissing, cloudinaryLoader } from '@/lib/utils'

const DEFAULT_IMG_SIZE = 250
const IMG_STYLE = 'h-full w-full rounded-md border shadow-sm absolute top-0 left-0'

type FirstColumnCellProps<TData> = {
  row: Row<TData>
  table: Table<TData>
}

export function FirstColumnCell<TData>({ row, table }: FirstColumnCellProps<TData>) {
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

  const ItemText = (
    <Typography className='truncate max-w-full group-hover/row:text-foreground'>
      {displayName}
    </Typography>
  )

  return (
    <div className='flex flex-col gap-3 -mt-6'>
      <div className='flex items-center justify-center px-8'>
        <CheckboxLarge
          className='absolute left-0 group/checkbox'
          checkboxClassName={`invisible group-hover/row:visible
            ${(isRowSelected || isCheckboxVisible) && 'visible '}
            ${
              !isRowSelected &&
              'group-hover/checkbox:bg-secondary group-hover/checkbox:border-primary/90'
            }
          `}
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
              hover:underline group/link relative group-hover/row:text-foreground
            `}
          >
            {ItemText}
            <ExternalLinkIcon
              className={`absolute -right-3 invisible group-hover/link:visible`}
            />
          </Link>
        )}
      </div>

      <div className={`flex h-32 rounded-md relative`}>
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
            bg-gradient-to-t from-secondary from-15% invisible group-hover/row:visible z-10`}
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
