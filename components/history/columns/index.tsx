'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Tag } from '@prisma/client'

import {
  Link1Icon,
  BookmarkIcon,
  Pencil2Icon,
  ExternalLinkIcon,
  ReaderIcon,
} from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Typography } from '@/components/typography'

import { DefaultHeader } from '@/components/history/columns/defaultHeader'
import {
  WebsiteHeader,
  WebsiteCell,
} from '@/components/history/columns/website'

import { DescriptionCell } from '@/components/history/columns/description'

export const FIXED_COLUMNS = ['website']

export const columns: ColumnDef<HistoryItem>[] = [
  {
    id: 'website',
    accessorKey: 'displayName',
    header: ({ table }) => <WebsiteHeader table={table} />,
    size: 200,
    minSize: 150,
    maxSize: 400,
    enableHiding: false,
    cell: ({ row, table }) => <WebsiteCell row={row} table={table} />,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => <DefaultHeader text='description' />,
    size: 300,
    minSize: 150,
    maxSize: 700,
    cell: ({ getValue }) => {
      const description = getValue() as string
      return <DescriptionCell description={description} />
    },
  },
  {
    id: 'summary',
    accessorKey: 'summary',
    header: () => <DefaultHeader text='summary' />,
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
    accessorKey: 'dataSourceTags',
    header: () => <DefaultHeader text='tags' />,
    size: 150,
    minSize: 100,
    maxSize: 300,
    cell: ({ getValue }) => {
      const tagList = getValue() as { tag: Tag }[]

      return (
        <div className='flex flex-wrap gap-2 px-2'>
          {tagList?.length
            ? tagList.map(({ tag }, index) => (
                <Button
                  key={index}
                  variant='outline'
                  size='sm'
                  className='shrink-0 max-w-full'
                >
                  {tag.name}
                </Button>
              ))
            : 'No tags'}
        </div>
      )
    },
  },
]
