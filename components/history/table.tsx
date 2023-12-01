'use client'

import { useState } from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'

import {
  ColumnDef,
  ColumnOrderState,
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

import { HistoryBreadcrumbs } from '@/components/history/breadcrumbs'
import { DraggableHeader } from '@/components/history/draggable-header'
import { ColumnDragLayer } from '@/components/history/drag-layer'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
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
    state: {
      columnOrder,
      columnVisibility,
      rowSelection,
      sorting,
    },
  })

  const { rows } = table.getRowModel()
  const areRowsSelected =
    table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected()

  const tableFields = table
    .getAllColumns()
    .filter((column) => column.getCanHide())
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
      <div className='rounded-md border cursor-default relative'>
        <div
          className={`absolute invisible w-full h-10 flex items-center
            first-letter:top-0 px-4 z-10 gap-4 rounded-t-md bg-background ${
              areRowsSelected && '!visible'
            }`}
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
            <Button variant='outline' size='sm'>
              Delete
            </Button>
          </div>
        </div>
        <Table className='table-fixed' style={{ width: table.getTotalSize() }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                // className='flex w-fit'
              >
                {headerGroup.headers.map((header, index) => (
                  <DraggableHeader
                    key={header.id}
                    header={header}
                    table={table}
                    index={index}
                  />
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows?.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row text-foreground/70 hover:text-foreground'
                  // className='flex w-fit'
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
      </div>
      <ColumnDragLayer />
    </>
  )
}
