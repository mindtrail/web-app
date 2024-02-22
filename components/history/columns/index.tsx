'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DefaultHeader } from '@/components/history/columns/defaultHeader'
import { DefaultCell } from '@/components/history/columns/defaultCell'
import { TagsCell } from '@/components/history/columns/tags'
import { SavedItemHeader, SavedItemCell } from '@/components/history/columns/savedItem'

import { formatDate } from '@/lib/utils'
import { MIN_COL_SIZE, MAX_COL_SIZE, DATA_TYPE } from '@/lib/constants'

export function getDefaultTableColumns<TData, TValue>(): ColumnDef<TData, TValue>[] {
  const tableColumns: ColumnDef<TData>[] = [
    {
      id: 'displayName',
      accessorKey: 'displayName',
      header: ({ table }) => <SavedItemHeader table={table} />,
      minSize: MIN_COL_SIZE,
      maxSize: MAX_COL_SIZE,
      enableHiding: false,
      cell: ({ row, table }) => <SavedItemCell row={row} table={table} />,
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: () => <DefaultHeader id='description' />,
      minSize: MIN_COL_SIZE,
      maxSize: MAX_COL_SIZE * 1.5,

      cell: ({ getValue }) => <DefaultCell text={getValue() as string} />,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: () => <DefaultHeader id='createdAt' />,
      minSize: MIN_COL_SIZE,
      maxSize: MAX_COL_SIZE,
      cell: ({ getValue }) => <DefaultCell text={formatDate(getValue() as string)} />,
    },
    {
      id: 'dataSourceTags',
      accessorKey: 'dataSourceTags',
      header: () => <DefaultHeader id='dataSourceTags' />,
      minSize: MIN_COL_SIZE,
      maxSize: MAX_COL_SIZE,
      cell: ({ getValue, column }) => (
        <TagsCell columnSize={column.getSize()} tagList={getValue() as DataSourceTag[]} />
      ),
    },
  ]

  return tableColumns
}

export function getHighlightsTableColumns<TData, TValue>(): ColumnDef<TData, TValue>[] {
  const tableColumns: ColumnDef<TData>[] = [
    {
      id: 'displayName',
      accessorKey: 'displayName',
      header: ({ table }) => (
        <SavedItemHeader table={table} resourceType={DATA_TYPE.HIGHLIGHTS} />
      ),
      minSize: MIN_COL_SIZE,
      maxSize: MAX_COL_SIZE,
      enableHiding: false,
      cell: ({ row, table }) => <SavedItemCell row={row} table={table} />,
    },
  ]

  return tableColumns
}
