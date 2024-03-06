'use client'

import { memo, useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
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
import { HistoryBreadcrumbs } from '@/components/history/breadcrumbs'
import { DraggableHeader } from '@/components/history/draggable-header'
import { ColumnDragLayer } from '@/components/history/drag-layer'
import { VisibilityDropdown } from '@/components/history/visibility-dropdown'
import { PreviewItem } from '@/components/history/preview'
import {
  getDefaultTableColumns,
  getHighlightsTableColumns,
} from '@/components/history/columns'

import { ActionBar } from '@/components/action-bar/action-bar'

import {
  DEFAULT_COLUMN_SIZE,
  DEFAULT_COLUMN_VISIBILITY,
  DEFAULT_COLUMN_ORDER,
  ENTITY_TYPE,
} from '@/lib/constants'

interface DataTableProps<TData> {
  data: TData[]
  processing?: boolean
  userPreferences?: UserPreferences
  handlePreferenceUpdate: (prefs: UserTablePrefs) => void
}

export function DataTable<TData>(props: DataTableProps<TData>) {
  const { data, processing, userPreferences, handlePreferenceUpdate } = props

  const {
    columnOrder: storedColOrder,
    columnSize: storedColSize,
    columnVisibility: storedColVisibility,
  } = (userPreferences?.tablePrefs as UserTablePrefs) || {}

  const tableRef = useRef(null)
  const previewRef = useRef(null)

  const initialOrder = storedColOrder || DEFAULT_COLUMN_ORDER
  const initialSize = storedColSize || DEFAULT_COLUMN_SIZE
  const initialVis = storedColVisibility || DEFAULT_COLUMN_VISIBILITY

  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null)
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialOrder)
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(initialSize)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVis)
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])

  const pathname = usePathname()
  const pathFragments = pathname.split('/')
  const entityType = pathFragments[1]
  const entityId = pathFragments[2]

  const entityIsHighlight = entityType === ENTITY_TYPE.HIGHLIGHTS

  const columns = useMemo(
    () => (entityIsHighlight ? getHighlightsTableColumns() : getDefaultTableColumns()),
    [entityIsHighlight],
  )

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // @ts-ignore
    getSubRows: (row) => row.subRows,
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

  const isColResizing = !!table.getState().columnSizingInfo.isResizingColumn
  const areRowsSelected =
    table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected()

  useEffect(() => {
    if (!Object.keys(rowSelection)?.length) {
      setPreviewItem(null)
    }
  }, [rowSelection])

  const handleClickOutside = useCallback((event: { target: any }) => {
    const tableEl = tableRef.current
    const previewEl = previewRef.current

    if (!tableEl || !previewEl) {
      return
    }

    if (
      !(tableEl as HTMLElement)?.contains(event.target) &&
      !(previewEl as HTMLElement)?.contains(event.target)
    ) {
      setPreviewItem(null)
    }
  }, [])

  useEffect(() => {
    if (!areRowsSelected) {
      return
    }
    window.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') {
          setRowSelection({})
        }
      },
      { once: true },
    )
  }, [areRowsSelected])

  useEffect(() => {
    if (!previewItem) {
      return
    }
    window.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape') {
          setPreviewItem(null)
        }
      },
      { once: true },
    )

    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [previewItem, handleClickOutside])

  return (
    <>
      <div className='flex items-center justify-between py-4'>
        <HistoryBreadcrumbs />
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='ghost' className='shrink-0'>
            <CaretSortIcon className='h-5 w-5' />
            A-Z
          </Button>

          {!entityIsHighlight && (
            <VisibilityDropdown
              table={table}
              columnOrder={columnOrder}
              handlePreferenceUpdate={handlePreferenceUpdate}
            />
          )}
        </div>
      </div>

      <div className='flex flex-1'>
        <ScrollArea className='rounded-md border cursor-default max-h-[calc(100vh-165px)] pb-2'>
          {areRowsSelected && (
            <ActionBar table={table} entityType={entityType} entityId={entityId} />
          )}

          <Table
            ref={tableRef}
            className='table-fixed'
            style={!entityIsHighlight ? { width: table.getTotalSize() } : {}}
          >
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
            {isColResizing ? (
              // @ts-ignore
              <MemoizedTableBody table={table} />
            ) : (
              <TableBodyContent
                table={table}
                entityIsHighlight={entityIsHighlight}
                setPreviewItem={setPreviewItem}
              />
            )}
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
        <div
          ref={previewRef}
          className={`absolute h-[calc(100vh-165px)] w-0 invisible
          right-0 top-[132px] md:top-[148px] z-20
          bg-background shadow-lg rounded-ss-lg rounded-es-lg
          transition-all
          ${previewItem && !areRowsSelected && '!visible !w-[calc(100%-450px)] border'}
        `}
        >
          <div
            className={`overflow-auto max-w-0 h-full
              ${previewItem && !areRowsSelected && '!max-w-full'}
            `}
          >
            {previewItem && (
              <PreviewItem previewItem={previewItem} setPreviewItem={setPreviewItem} />
            )}
          </div>
        </div>
      </div>
      <ColumnDragLayer />
    </>
  )
}

interface TableBodyProps {
  table: ReactTable<HistoryItem>
  entityIsHighlight: boolean
  setPreviewItem: (item: HistoryItem) => void
}

function TableBodyContent({ table, entityIsHighlight, setPreviewItem }: TableBodyProps) {
  const { flatRows: rows } = table.getRowModel()

  return (
    <TableBody>
      {rows?.map((row) => {
        const isRowSelected = row.getIsSelected()

        return (
          <TableRow
            key={row.id}
            onClick={() => setPreviewItem(row.original)}
            data-state={isRowSelected && 'selected'}
            className={`group/row text-foreground/70 hover:text-foreground border-none
            ${isRowSelected && 'text-foreground'}`}
          >
            {row.getVisibleCells().map(({ id, column, getContext }) => {
              return (
                <TableCell
                  key={id}
                  className={`align-top cursor-pointer
                    ${column.id === 'actions' && 'text-center'}
                    ${entityIsHighlight ? '!pr-2 py-0' : 'pt-10'}
                  `}
                >
                  {flexRender(column.columnDef.cell, getContext())}
                </TableCell>
              )
            })}
          </TableRow>
        )
      })}
    </TableBody>
  )
}

// @ts-ignore -> useful for perf optimization on resizing columns
const MemoizedTableBody = memo(
  TableBodyContent,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody
