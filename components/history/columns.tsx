'use client'

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
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label='Select row'
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
    cell: ({ getValue, table }) => {
      const value = getValue() as string
      let rootDomain = value

      try {
        const url = new URL(value.includes('://') ? value : 'http://' + value)
        rootDomain = url.hostname
      } catch (e) {
        console.error(e)
      }
      return <div className='break-words'>{rootDomain}</div>
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
