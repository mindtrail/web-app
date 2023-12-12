'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'

import {
  Link1Icon,
  BookmarkIcon,
  Pencil2Icon,
  ExternalLinkIcon,
  ReaderIcon,
} from '@radix-ui/react-icons'

import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Typography } from '@/components/typography'
import { getHostName } from '@/lib/utils'

const addHttpsIfMissing = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url
  }
  return url
}

type LoaderProps = {
  src: string
  width: number
  quality?: number
}
// Custom loader function
const cloudinaryLoader = ({ src, width = 200, quality }: LoaderProps) => {
  const cloudinaryBase = 'https://res.cloudinary.com/dea7r24ca/image/fetch/'
  return `${cloudinaryBase}w_${width},q_${quality || 75}/${src}`
}

export const FIXED_COLUMNS = ['displayName']

export const columns: ColumnDef<HistoryItem>[] = [
  {
    id: 'displayName',
    accessorKey: 'displayName',
    header: ({ table }) => (
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
    ),
    size: 200,
    minSize: 150,
    maxSize: 400,
    enableHiding: false,
    cell: ({ row, getValue }) => {
      const isRowSelected = row.getIsSelected()

      const { original } = row
      console.log(original)
      // @TODO: Store the hostname in the database in the first place
      // @ts-ignore
      const {
        image = '',
        title = 'Title',
        updatedAt,
        name,
      } = original as HistoryItem

      const host = decodeURIComponent(getHostName(getValue() as string))

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
            <Typography className='line-clamp-1 text-center'>{host}</Typography>
            <ExternalLinkIcon
              className={`absolute -right-1 invisible group-hover/website:visible`}
            />
          </Link>
          <Checkbox
            className={`absolute mt-[2px] left-2 invisible group-hover/row:visible ${
              isRowSelected && 'visible'
            }`}
            checked={isRowSelected}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
          <div
            className={`w-full h-32 rounded-md flex flex-col justify-between p-3 group/car relative`}
          >
            {image ? (
              <Image
                loader={cloudinaryLoader}
                src={image as string}
                alt={title as string}
                layout='fill'
                className='absolute top-0 left-0 rounded-md border shadow-sm object-contain'
              />
            ) : (
              <div className='absolute top-0 left-0 rounded-md border shadow-sm w-48 h-32 bg-gray-100'></div>
            )}
            <Typography
              className={`self-end invisible group-hover/row:visible z-10`}
              variant='small'
            >
              {updatedDate}
            </Typography>
            <Typography
              className='line-clamp-2 invisible group-hover/row:visible z-10 shadow-sm bg-white/50 rounded-md'
              variant='small'
            >
              {title}
            </Typography>
          </div>
        </div>
      )
    },
  },
  {
    id: 'Description',
    accessorKey: 'status',
    header: () => (
      <div className='flex items-center gap-2 px-2'>
        <ReaderIcon /> Description
      </div>
    ),
    size: 300,
    minSize: 150,
    maxSize: 700,
    cell: ({ getValue }) => {
      const description = getValue() as string
      return (
        <div className='flex items-center gap-2 px-2'>
          <Typography className='line-clamp-5'>
            {description || 'No description'}
          </Typography>
        </div>
      )
    },
  },
  {
    id: 'summary',
    accessorKey: 'summary',
    header: () => (
      <div className='flex items-center gap-2 px-2'>
        <Pencil2Icon /> Summary
      </div>
    ),
    size: 350,
    minSize: 150,
    maxSize: 700,
    cell: ({ getValue }) => {
      const summary = getValue() as string
      return (
        <div className='flex items-center gap-2 px-2'>
          <Typography className='line-clamp-5'>
            {summary || 'No summary'}
          </Typography>
        </div>
      )
    },
  },
  {
    id: 'tags',
    accessorKey: 'tags',
    header: () => (
      <div className='flex items-center gap-2 px-2'>
        <BookmarkIcon /> Tags
      </div>
    ),
    size: 150,
    minSize: 100,
    maxSize: 300,
    cell: ({ getValue }) => {
      const tagList = getValue() as string[]

      return (
        <div className='flex flex-wrap gap-2 px-2'>
          {tagList?.length
            ? tagList.map((tag, index) => (
                <Button
                  key={index}
                  variant='outline'
                  size='sm'
                  className='shrink-0 max-w-full'
                >
                  {tag}
                </Button>
              ))
            : 'No tags'}
        </div>
      )
    },
  },
]
