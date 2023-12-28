'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DefaultHeader } from '@/components/history/columns/defaultHeader'
import { DefaultCell } from '@/components/history/columns/defaultCell'
import { TagsCell } from '@/components/history/columns/tags'
import {
  SavedItemHeader,
  SavedItemCell,
} from '@/components/history/columns/savedItem'

import { formatDate } from '@/lib/utils'
import { MIN_SIZE, MAX_SIZE } from '@/lib/constants'

export function getTableColumns<TData, TValue>(
  columnOrder?: string[],
): ColumnDef<TData, TValue>[] {
  console.log('getTableColumns', columnOrder)

  const tableColumns: ColumnDef<TData>[] = [
    {
      id: 'item',
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
      header: () => <DefaultHeader text='description' />,
      minSize: MIN_SIZE,
      maxSize: MAX_SIZE * 1.5,

      cell: ({ getValue }) => <DefaultCell text={getValue() as string} />,
    },
    {
      id: 'created',
      accessorKey: 'createdAt',
      header: () => <DefaultHeader text='created' />,
      minSize: MIN_SIZE,
      maxSize: MAX_SIZE,
      cell: ({ getValue }) => (
        <DefaultCell text={formatDate(getValue() as string)} />
      ),
    },
    {
      id: 'tags',
      accessorKey: 'dataSourceTags',
      header: () => <DefaultHeader text='tags' />,
      minSize: MIN_SIZE,
      maxSize: MAX_SIZE,
      cell: ({ getValue }) => (
        <TagsCell tagList={getValue() as DataSourceTag[]} />
      ),
    },
  ]

  let result = columnOrder ? tableColumns : tableColumns

  return result
}
