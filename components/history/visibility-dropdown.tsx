import { Table, ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface VisibilityDropdownProps {
  table: Table<HistoryItem>
}

export function VisibilityDropdown({ table }: VisibilityDropdownProps) {
  const tableFields = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    // .sort((a, b) => a.id - b.id)
    .map((column) => {
      return (
        <DropdownMenuCheckboxItem
          key={column.id}
          className='capitalize'
          checked={column.getIsVisible()}
          onCheckedChange={(value) => column.toggleVisibility(!!value)}
        >
          {column.id}
        </DropdownMenuCheckboxItem>
      )
    })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          Fields
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>{tableFields}</DropdownMenuContent>
    </DropdownMenu>
  )
}

const sortColumns = (
  columns: ColumnDef<HistoryItem>[],
  columnOrder: string[],
): ColumnDef<HistoryItem>[] => {
  const sortedCols = [...columns].sort((a, b) => {
    // @ts-ignore --- Get the order index for both columns
    const orderA = columnOrder.indexOf(a.id) // @ts-ignore
    const orderB = columnOrder.indexOf(b.id)

    // Compare the order indexes
    return orderA - orderB
  })

  return sortedCols
}
