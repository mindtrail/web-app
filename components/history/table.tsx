'use client'

import { useMemo, useState } from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { UserPreferences } from '@prisma/client'

import {
  Table as ReactTable,
  ColumnOrderState,
  ColumnSizingState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons/next-icons'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'

import { getTableColumns } from '@/components/history/columns'
import { HistoryBreadcrumbs } from '@/components/history/breadcrumbs'
import { DraggableHeader } from '@/components/history/draggable-header'
import { ColumnDragLayer } from '@/components/history/drag-layer'
import { VisibilityDropdown } from '@/components/history/visibility-dropdown'

import { ActionBar } from '@/components/history/action-bar'

import {
  DEFAULT_COLUMN_SIZE,
  DEFAULT_COLUMN_VISIBILITY,
  DEFAULT_COLUMN_ORDER,
} from '@/lib/constants'

interface DataTableProps<TData> {
  data: TData[]
  processing?: boolean
  userPreferences?: UserPreferences
  handlePreferenceUpdate: (prefs: UserTablePrefs) => void
}

export function DataTable<TData>({
  data,
  processing,
  userPreferences,

  handlePreferenceUpdate,
}: DataTableProps<TData>) {
  const {
    columnOrder: storedColOrder,
    columnSize: storedColSize,
    columnVisibility: storedColVisibility,
  } = (userPreferences?.tablePrefs as UserTablePrefs) || {}

  const initialOrder = storedColOrder || DEFAULT_COLUMN_ORDER
  const initialSize = storedColSize || DEFAULT_COLUMN_SIZE
  const initialVis = storedColVisibility || DEFAULT_COLUMN_VISIBILITY

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialOrder)
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(initialSize)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVis)
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(() => getTableColumns(), [])

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
    onColumnSizingChange: setColumnSizing,
    state: {
      columnOrder,
      columnSizing,
      columnVisibility,
      rowSelection,
      sorting,
    },
  }) as ReactTable<HistoryItem>

  const { rows } = table.getRowModel()
  const areRowsSelected =
    table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected()

  return (
    <>
      <div className='flex items-center justify-between py-4'>
        <HistoryBreadcrumbs />
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='ghost' className='shrink-0'>
            <CaretSortIcon className='h-5 w-5' />
            A-Z
          </Button>

          <VisibilityDropdown
            table={table}
            columnOrder={columnOrder}
            handlePreferenceUpdate={handlePreferenceUpdate}
          />
        </div>
      </div>
      <ScrollArea className='rounded-md border cursor-default max-h-[calc(100vh-165px)]'>
        {areRowsSelected && <ActionBar table={table} />}

        <Table className='table-fixed' style={{ width: table.getTotalSize() }}>
          <TableHeader className='sticky top-0 bg-background border-b shadow-sm z-10'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <DraggableHeader
                    key={header.id}
                    header={header}
                    table={table}
                    handlePreferenceUpdate={handlePreferenceUpdate}
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
