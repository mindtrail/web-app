'use client'

import { MouseEvent, useMemo, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  VisibilityState,
  Row,
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
import { filter } from 'cheerio/lib/api/traversing'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  })

  const { rows } = table.getRowModel()
  const visibleCols = table.getVisibleFlatColumns()

  return (
    <>
      <div className='flex items-center py-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={`rounded-md border`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={`w-full grid lg:gap-2 grid-cols-${visibleCols.length}`}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='flex items-center'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows?.length ? (
              rows?.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`w-full grid lg:gap-2 grid-cols-${visibleCols.length}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

interface HistoryTableProps {
  items: HistoryItem[]
  filters?: HistoryFilter[]
  columns: HistoryFilter[]
  handleTagListClick: (event: MouseEvent<HTMLButtonElement>) => void
  handleHistoryDelete: (
    event: MouseEvent<HTMLButtonElement>,
    historyItem: HistoryItem,
  ) => void
}

export function HistoryTable(props: HistoryTableProps) {
  const { items, filters, columns, handleTagListClick, handleHistoryDelete } =
    props

  const gridStyle = useMemo(() => {
    return `grid grid-cols-${
      columns.length + 1
    } cursor-default px-4 gap-2 lg:gap-4`
  }, [columns])

  if (!items?.length) {
    return
  }
}
