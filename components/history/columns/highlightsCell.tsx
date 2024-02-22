import Link from 'next/link'
import { Table, Row } from '@tanstack/react-table'
import { GlobeIcon, FileTextIcon, DividerHorizontalIcon } from '@radix-ui/react-icons'
import { DataSourceType } from '@prisma/client'

import { Checkbox } from '@/components/ui/checkbox'
import { Typography } from '@/components/typography'

import { IconCollection, IconTag, IconAllData } from '@/components/ui/icons/next-icons'

import { addHttpsIfMissing, cloudinaryLoader, formatDate } from '@/lib/utils'

const IMG_SIZE = 100
const IMG_STYLE = `w-full h-full rounded-md shadow-sm absolute top-0 left-0`
const SECONDARY_TXT_STYLE = 'text-muted-foreground flex gap-1 items-center'

type HighlightsCellProps<TData> = {
  row: Row<TData>
  table: Table<TData>
}

export function HighlightsCell<TData>({ row, table }: HighlightsCellProps<TData>) {
  const { original } = row
  const isRowSelected = row.getIsSelected()
  const isCheckboxVisible = table.getIsSomePageRowsSelected()

  const {
    clippings = [],
    createdAt,
    collectionDataSource = [],
    dataSourceTags = [],
    image = '',
    title = 'Title',
    name,
    displayName,
    type,
  } = original as HistoryItem
  console.log(original, type)

  const fileType = type === DataSourceType.file ? displayName.split('.').pop() : null

  if (!name) {
    return null
  }

  return (
    <div className='flex gap-4 md:gap-6 py-2'>
      <div className={`flex rounded-md relative w-[100px] h-[80px] shrink-0`}>
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
      <div className='flex flex-col flex-1 gap-2'>
        <Typography className='truncate max-w-full text-foreground/90' variant='text-lg'>
          {title}
        </Typography>
        <div className='flex gap-4 items-center'>
          <Typography className={SECONDARY_TXT_STYLE} variant='small'>
            {displayName}
          </Typography>
          <Typography className={SECONDARY_TXT_STYLE} variant='small'>
            {formatDate(new Date(createdAt))}
          </Typography>
        </div>
        <div className='flex gap-4 items-center mt-2'>
          {collectionDataSource?.length ? (
            collectionDataSource?.map(({ collection }, index) => (
              <Typography key={index} className={SECONDARY_TXT_STYLE} variant='small'>
                <IconCollection className='w-3 h-3' />
                {collection?.name}
              </Typography>
            ))
          ) : (
            <Typography className={SECONDARY_TXT_STYLE} variant='small'>
              <IconAllData className='w-3 h-3' />
              All Items
            </Typography>
          )}

          <Typography className={SECONDARY_TXT_STYLE} variant='small'>
            {dataSourceTags?.map(({ tag }, index) => (
              <span className='inline-flex items-center gap-1' key={index}>
                <IconTag className='w-3 h-3' /> {tag?.name}
              </span>
            ))}
          </Typography>
        </div>
      </div>
    </div>
  )
}

// <div className='flex items-center px-8'>
//         <Checkbox
//           className={`absolute mt-[2px] bg-white left-4 invisible group-hover/row:visible ${
//             (isRowSelected || isCheckboxVisible) && 'visible'
//           }`}
//           checked={isRowSelected}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label='Select row'
//         />
//         <Typography className='truncate max-w-full'>{displayName}</Typography>{' '}
//       </div>
