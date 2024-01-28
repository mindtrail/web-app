import { useCallback, useMemo } from 'react'
import { Table, Column } from '@tanstack/react-table'

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
  handlePreferenceUpdate: (prefs: UserTablePrefs) => void
}

export function VisibilityDropdown(props: VisibilityDropdownProps) {
  const { table, columnOrder, handlePreferenceUpdate } = props

  const tableColumns = useMemo(
    () =>
      table
        ?.getAllFlatColumns()
        ?.filter((column) => column.getCanHide())
        ?.sort((a, b) => {
          // Get the order index for both columns
          const orderA = columnOrder?.indexOf(a.id)
          const orderB = columnOrder?.indexOf(b.id)

          // Compare the order indexes
          return orderA - orderB
        }),
    [columnOrder, table],
  )

  const handleVisibilityChange = useCallback(
    (column: Column<HistoryItem, unknown>, checked: boolean) => {
      column.toggleVisibility()

      const columnVisibility = { ...table.getState().columnVisibility }
      const updatedVisibility = {
        ...columnVisibility,
        [column.id]: !!checked,
      }

      handlePreferenceUpdate({ columnVisibility: updatedVisibility })
    },
    [table, handlePreferenceUpdate],
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          Fields
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuCheckboxItem className='capitalize' disabled={true} checked={true}>
          Item
        </DropdownMenuCheckboxItem>
        {tableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className='capitalize'
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => handleVisibilityChange(column, checked)}>
            {COLUMN_LABELS[column.id]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
