'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DefaultHeader } from '@/components/history/columns/defaultHeader'
import { DefaultCell } from '@/components/history/columns/defaultCell'
import { TagsCell } from '@/components/history/columns/tags'
import { SavedItemHeader, SavedItemCell } from '@/components/history/columns/savedItem'

import { formatDate } from '@/lib/utils'
import { MIN_SIZE, MAX_SIZE, COLUMN_LABELS } from '@/lib/constants'

export function getTableColumns<TData, TValue>(): ColumnDef<TData, TValue>[] {
  const tableColumns: ColumnDef<TData>[] = [
    {
      id: 'displayName',
      accessorKey: 'displayName',
      accessorFn: (row) => {},
      header: ({ table }) => <SavedItemHeader table={table} />,
      minSize: MIN_SIZE,
      maxSize: MAX_SIZE,
      enableHiding: false,
      cell: ({ row, table }) => <SavedItemCell row={row} table={table} />,
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: () => <DefaultHeader id='description' />,
      minSize: MIN_SIZE,
      maxSize: MAX_SIZE * 1.5,

      cell: ({ getValue }) => <DefaultCell text={getValue() as string} />,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: () => <DefaultHeader id='createdAt' />,
      minSize: MIN_SIZE,
      maxSize: MAX_SIZE,
      cell: ({ getValue }) => <DefaultCell text={formatDate(getValue() as string)} />,
    },
    {
      id: 'dataSourceTags',
      accessorKey: 'dataSourceTags',
      header: () => <DefaultHeader id='dataSourceTags' />,
      minSize: MIN_SIZE,
      maxSize: MAX_SIZE,
      cell: ({ getValue }) => <TagsCell tagList={getValue() as DataSourceTag[]} />,
    },
  ]

  return tableColumns
}
