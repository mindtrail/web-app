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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const addHttpsIfMissing = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url
  }
  return url
}

export const FIXED_COLUMNS = ['displayName']

export const columns: ColumnDef<HistoryItem>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: 'displayName',
    accessorKey: 'displayName',
    header: () => (
      <div className='flex items-center gap-2 px-2'>
        <Link1Icon /> Website
      </div>
    ),
    size: 200,
    minSize: 150,
    maxSize: 400,
    enableHiding: false,
    cell: ({ row }) => {
      const isRowSelected = row.getIsSelected()

      const { original } = row
      // @TODO: Store the hostname in the database in the first place
      // @ts-ignore
      const { hostName, updatedAt, pageTitle, name } = original

      const updatedDate = new Date(updatedAt).toLocaleDateString('en-US')

      if (!name) {
        return null
      }

      return (
        <div className='flex flex-col items-center gap-2 relative -mt-6'>
          <div className='flex justify-center items-center group/link pr-4'>
            <div className='break-words relative flex items-center'>
              <Link
                href={addHttpsIfMissing(name)}
                target='_blank'
                className={`absolute -right-8 invisible group-hover/link:visible
                ${buttonVariants({ variant: 'link', size: 'sm' })}`}
              >
                <ExternalLinkIcon />
              </Link>
              {hostName}
            </div>
            <Checkbox
              className={`absolute left-2 invisible group-hover/row:visible ${
                isRowSelected && 'visible'
              }`}
              checked={isRowSelected}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label='Select row'
            />
          </div>

          <div className='bg-slate-300 w-full h-32 rounded-md flex flex-col justify-between p-2 group/card'>
            <Typography
              className={`self-end invisible group-hover/card:visible`}
              variant='small'
            >
              {updatedDate}
            </Typography>
            <Typography className='line-clamp-2' variant='small'>
              {pageTitle}
            </Typography>
          </div>
        </div>
      )
    },
  },
  {
    id: 'Description',
    accessorKey: 'metaDescription',
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
          <Typography className='line-clamp-5'>{summary}</Typography>
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

      if (!tagList.length) {
        return null
      }

      return (
        <div className='flex flex-wrap gap-2 px-2'>
          {tagList.map((tag, index) => (
            <Button
              key={index}
              variant='outline'
              size='sm'
              className='shrink-0 max-w-full'
            >
              {tag}
            </Button>
          ))}
        </div>
      )
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const history = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button
  //             variant='ghost'
  //             className='h-8 w-8 p-0 hover:shadow-sm ml-auto mr-auto'
  //           >
  //             <span className='sr-only'>Open menu</span>
  //             <DotsHorizontalIcon />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align='end'>
  //           <DropdownMenuItem>Edit</DropdownMenuItem>
  //           <DropdownMenuItem>Delete</DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>Add to Collection</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]

const getHostName = (urlString: string) => {
  try {
    const url = new URL(
      urlString.includes('://') ? urlString : 'https://' + urlString,
    )
    return url.hostname
  } catch (e) {
    console.error(e)
    return urlString
  }
}
