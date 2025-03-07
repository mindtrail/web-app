'use client'

import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { UserPreferences } from '@prisma/client'
import { Cross1Icon } from '@radix-ui/react-icons'

import {
  Table as ReactTable,
  ColumnOrderState,
  ColumnSizingState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons/next-icons'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Table, TableHeader, TableRow } from '@/components/ui/table'

import { ActionBar } from '@/components/action-bar/action-bar'
import { HistoryBreadcrumbs } from '@/components/history/breadcrumbs'
import { DraggableHeader } from '@/components/history/draggable-header'
import { ColumnDragLayer } from '@/components/history/drag-layer'
import { VisibilityDropdown } from '@/components/history/visibility-dropdown'
import { PreviewItem } from '@/components/history/preview'
import { Chat } from '@/components/chat'

import {
  getDefaultTableColumns,
  getHighlightsTableColumns,
} from '@/components/history/columns'

import { TableBodyComponent, MemoizedTableBody } from '@/components/history/table-body'

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

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event?.target as HTMLElement

    if (!target) {
      return
    }

    const tableEl = tableRef.current
    const previewEl = previewRef.current

    if (!tableEl || !previewEl) {
      return
    }

    if (
      (tableEl as HTMLElement)?.contains(target) ||
      (previewEl as HTMLElement)?.contains(target) ||
      // check if the classlists contains a part of the string rpv-core
      target.classList.value.includes('rpv-core') ||
      // check if target was the trigger to download the file
      (target.tagName === 'A' && (target as HTMLAnchorElement).href.startsWith('blob:'))
    ) {
      return
    }

    setPreviewItem(null)
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
          <div
            className={`absolute w-full flex items-center h-12 bg-background border-b
              shadow-sm first-letter:top-0 rounded-t-md
              ${areRowsSelected && 'z-20'}
            `}
          >
            {areRowsSelected && (
              <ActionBar table={table} entityType={entityType} entityId={entityId} />
            )}
          </div>

          <Table
            ref={tableRef}
            className='table-fixed'
            style={!entityIsHighlight ? { width: table.getTotalSize() } : {}}
          >
            <TableHeader className='sticky top-0 bg-background shadow-sm z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='border-none'>
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
              <TableBodyComponent
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
            bg-background shadow-xl rounded-ss-lg rounded-es-lg
            transition-all
            ${previewItem && !areRowsSelected && '!visible !w-[calc(100%-470px)] border'}
        `}
        >
          <div
            className={`max-w-0 h-full flex
              ${previewItem && !areRowsSelected && '!max-w-full'}
            `}
          >
            {previewItem && (
              <div className='flex flex-col w-full'>
                <div className='flex justify-between items-center h-12 px-2 gap-4 bg-muted'>
                  <Button onClick={() => setPreviewItem(null)} variant='ghost'>
                    <Cross1Icon className='w-4 h-4' />
                  </Button>
                  {/* {previewItem?.title} */}
                </div>

                <div className='flex flex-1 overflow-auto'>
                  <PreviewItem
                    previewItem={previewItem}
                    setPreviewItem={setPreviewItem}
                  />
                  <Chat className='w-56 sm:w-64 md:w-72 lg:w-80 2xl:w-96 border-l bg-background' />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ColumnDragLayer />
    </>
  )
}
