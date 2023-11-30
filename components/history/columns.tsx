'use client'

import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const FIXED_COLUMNS = ['select']

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
    header: 'Website',
    size: 250,
    minSize: 150,
    maxSize: 400,
    cell: ({ getValue, row }) => {
      const value = getValue() as string
      const rowIsSelected = row.getIsSelected()

      // @TODO: Store the hostname in the database in the first place
      const rootDomain = getHostName(value)

      return (
        <div className='flex flex-col items-center gap-2 py-1 group'>
          <div className='flex justify-center items-center relative w-full '>
            <Checkbox
              className={`absolute left-2 invisible group-hover:visible ${
                rowIsSelected && 'visible'
              }`}
              checked={rowIsSelected}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label='Select row'
            />

            <div className='break-words'>{rootDomain}</div>
          </div>
          <div className='bg-slate-300 w-full h-32 rounded-md'>
            {/* <Image alt='test' src='' /> */}
          </div>
        </div>
      )
    },
  },
  {
    id: 'summary',
    accessorKey: 'summary',
    header: 'Summary',
    size: 500,
    minSize: 150,
    maxSize: 700,
  },
  {
    id: 'tags',
    accessorKey: 'tags',
    header: 'Tags',
    size: 150,
    minSize: 100,
    maxSize: 300,
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
