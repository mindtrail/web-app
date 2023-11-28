'use client'

import { useMemo, useState } from 'react'
import {
  Share2Icon,
  CaretSortIcon,
  ListBulletIcon,
} from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { HistoryBreadcrumbs } from '@/components/history/breadcrumbs'

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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { DraggableHeader } from '@/components/history/draggable-header'
import { ColumnDragLayer } from '@/components/history/drag-layer'

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

  const resetOrder = () => {
    setColumnOrder(columns.map((column) => column.id as string))
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    // debugHeaders: true, // TODO: comment for production or use env variable
    debugTable: true,
    // debugColumns: true,
    state: {
      columnOrder,
      columnVisibility,
      rowSelection,
      sorting,
    },
  })

  const { rows } = table.getRowModel()

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

        <div className='flex items-center'>
          <Button size='sm' variant='ghost'>
            <ListBulletIcon className='h-5 w-5' />
          </Button>

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

          <Button size='sm' variant='ghost'>
            <Share2Icon className='h-5 w-5' />
          </Button>
        </div>
      </div>

      <div className='rounded-md border w-full relative'>
        <Table className='table-fixed'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
          {/* <ScrollArea className={`max-h-[calc(100vh-300px)]`}> */}
          <TableBody>
            {rows?.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='border-collapse'
                >
                  {row.getVisibleCells().map(({ id, column, getContext }) => (
                    <TableCell
                      key={id}
                      className={`${column.id === 'actions' && 'text-center'}`}
                    >
                      {flexRender(column.columnDef.cell, getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
          {/* </ScrollArea> */}
        </Table>
        <ColumnDragLayer />
      </div>
    </>
  )
}
