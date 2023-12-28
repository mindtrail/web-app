import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { COLUMN_LABELS } from '@/lib/constants'

interface VisibilityDropdownProps {
  table: Table<HistoryItem>
  columnOrder: string[]
}

export function VisibilityDropdown({ table, columnOrder }: VisibilityDropdownProps) {
  const tableColumns = table
    ?.getAllFlatColumns()
    ?.filter((column) => column.getCanHide())
    ?.sort((a, b) => {
      // Get the order index for both columns
      const orderA = columnOrder?.indexOf(a.id)
      const orderB = columnOrder?.indexOf(b.id)

      // Compare the order indexes
      return orderA - orderB
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          Fields
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {tableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className='capitalize'
            checked={column.getIsVisible()}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          >
            {COLUMN_LABELS[column.id]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
