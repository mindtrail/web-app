'use client'

import { ColumnDef } from '@tanstack/react-table'
import { UserPreferences } from '@prisma/client'

import { DefaultHeader } from '@/components/history/columns/defaultHeader'
import { DefaultCell } from '@/components/history/columns/defaultCell'
import { TagsCell } from '@/components/history/columns/tags'
import {
  SavedItemHeader,
  SavedItemCell,
} from '@/components/history/columns/savedItem'

import { formatDate } from '@/lib/utils'
import { MIN_SIZE, MAX_SIZE } from '@/lib/constants'

export const getColumnsDefinition = (userPreferences?: UserPreferences) => {
  if (!userPreferences) {
    return columns
  }

  let updatedColumns = columns

  const { columnSize } = userPreferences?.tablePrefs as UserTablePrefs

  if (columnSize) {
    // updatedColumns = updateColumnSize(columns, columnSize)
  }

  return updatedColumns
}

const columns: ColumnDef<HistoryItem>[] = [
  {
    id: 'displayName',
    accessorKey: 'displayName',
    header: ({ table }) => <SavedItemHeader table={table} />,
    // size: 200,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
    enableHiding: false,
    cell: ({ row, table }) => <SavedItemCell row={row} table={table} />,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => <DefaultHeader text='description' />,
    // size: 300,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE * 1.5,

    cell: ({ getValue }) => <DefaultCell text={getValue() as string} />,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => <DefaultHeader text='created' />,
    // size: 150,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
    cell: ({ getValue }) => (
      <DefaultCell text={formatDate(getValue() as string)} />
    ),
  },
  {
    id: 'dataSourceTags',
    accessorKey: 'dataSourceTags',
    header: () => <DefaultHeader text='tags' />,
    // size: 200,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
    cell: ({ getValue }) => (
      <TagsCell tagList={getValue() as DataSourceTag[]} />
    ),
  },
]

const updateColumnSize = (
  columns: ColumnDef<HistoryItem>[],
  columnSize: Record<string, number>,
): ColumnDef<HistoryItem>[] => {
  return columns.map((column) => ({
    ...column, // @ts-ignore -> TODO: fix this as it does not recognize the id
    size: columnSize[column?.id] || column?.size,
  }))
}
