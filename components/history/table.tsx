'use client'

import { useCallback, useState } from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { UserPreferences } from '@prisma/client'

import {
  Column,
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { IconSpinner } from '@/components/ui/icons/next-icons'

import { HistoryBreadcrumbs } from '@/components/history/breadcrumbs'
import { DraggableHeader } from '@/components/history/draggable-header'
import { ColumnDragLayer } from '@/components/history/drag-layer'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { DEFAULT_COLUMN_SIZE, DEFAULT_COLUMN_VISIBILITY } from '@/lib/constants'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  processing?: boolean
  userPreferences?: UserPreferences
  handleHistoryDelete: (ids: HistoryItem[]) => void
  updateUserPreferences: (prefs: UserTablePrefs) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  processing,
  userPreferences,
  handleHistoryDelete,
  updateUserPreferences,
}: DataTableProps<TData, TValue>) {
  const {
    columnSize: storedColSize,
    columnOrder: storedColOrder,
    columnVisibility: storedColVisibility,
  } = userPreferences?.tablePrefs as UserTablePrefs

  const initialOrder =
    storedColOrder || columns.map((column) => column.id as string)

  const initialVisibility = storedColVisibility || DEFAULT_COLUMN_VISIBILITY

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialOrder)
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initialVisibility)
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
    storedColSize || DEFAULT_COLUMN_SIZE,
  )

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    debugTable: true,
    onColumnSizingChange: setColumnSizing,
    state: {
      columnOrder,
      columnVisibility,
      rowSelection,
      sorting,
      columnSizing,
    },
  })

  const { rows } = table.getRowModel()
  const areRowsSelected =
    table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected()

  const handleVisibilityChange = useCallback(
    (value: boolean, column: Column<TData, unknown>) => {
      console.log(column.id)
      console.log(value)

      const updatedVisibility = {
        ...columnVisibility,
        [column.id]: !!value,
      }
      console.log(updatedVisibility)

      column.toggleVisibility(!!value)
    },
    [columnVisibility],
  )

  const tableFields = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
    .map((column) => {
      return (
        <DropdownMenuCheckboxItem
          key={column.id}
          className='capitalize'
          checked={column.getIsVisible()}
          onCheckedChange={(value) => handleVisibilityChange(value, column)}
        >
          {column.id}
        </DropdownMenuCheckboxItem>
      )
    })

  const onDelete = useCallback(() => {
    const selectedRows = table.getSelectedRowModel()

    const itemsToDelete = selectedRows.rows.map(
      ({ original }) => original as HistoryItem,
    )

    console.log(selectedRows, itemsToDelete)
    handleHistoryDelete(itemsToDelete)
    table.resetRowSelection()
  }, [handleHistoryDelete, table])

  return (
    <>
      <div className='flex items-center justify-between py-4'>
        <HistoryBreadcrumbs />

        <div className='flex items-center gap-2'>
          <Button size='sm' variant='ghost'>
            <CaretSortIcon className='h-5 w-5' />
            A-Z
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                Fields
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>{tableFields}</DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ScrollArea className='rounded-md border cursor-default max-h-[calc(100vh-165px)]'>
        <div
          className={`absolute invisible w-full h-10 bg-background border-b shadow-sm
            flex items-center first-letter:top-0 px-4 z-20 gap-4 rounded-t-md
            ${areRowsSelected && '!visible'}`}
        >
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
          />
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
        <Table className='table-fixed' style={{ width: table.getTotalSize() }}>
          <TableHeader className='sticky top-0 bg-background border-b shadow-sm z-10'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <DraggableHeader
                    key={header.id}
                    header={header}
                    table={table}
                    updateUserPreferences={updateUserPreferences}
                  />
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows?.map((row) => {
              const isRowSelected = row.getIsSelected()
              return (
                <TableRow
                  key={row.id}
                  data-state={isRowSelected && 'selected'}
                  className={`group/row text-foreground/70 hover:text-foreground ${
                    isRowSelected && 'text-foreground'
                  }`}
                >
                  {row.getVisibleCells().map(({ id, column, getContext }) => (
                    <TableCell
                      key={id}
                      className={`align-top pt-10 ${
                        column.id === 'actions' && 'text-center'
                      }`}
                    >
                      {flexRender(column.columnDef.cell, getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {processing && (
          <div className='absolute top-0 w-full h-full border rounded-md bg-white/60 flex justify-center pt-52'>
            <div className='flex items-center gap-2 h-8'>
              <IconSpinner /> Searching...
            </div>
          </div>
        )}
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <ColumnDragLayer />
    </>
  )
}
