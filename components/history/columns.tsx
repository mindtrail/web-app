'use client'

import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type HistoryItem = {
//   displayName: string
//   summary: number
//   // status: 'pending' | 'processing' | 'success' | 'failed'
//   tags: 'pending' | 'processing' | 'success' | 'failed'
// }

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const columns: ColumnDef<HistoryItem>[] = [
  {
    accessorKey: 'displayName',
    header: 'Website',
    cell: ({ getValue, table }) => {
      const value = getValue() as string
      return <div className='break-words'>{value}</div>
    },
  },
  {
    accessorKey: 'summary',
    header: 'Summary',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      const history = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(history.id)}
            >
              Copy history ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View history details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
