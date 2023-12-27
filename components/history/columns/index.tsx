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

export const getColumnsDefinition = (userPreferences?: UserPreferences) => {
  if (!userPreferences) {
    return columns
  }

  return columns
}

const MIN_SIZE = 150
const MAX_SIZE = 600

const columns: ColumnDef<HistoryItem>[] = [
  {
    id: 'displayName',
    accessorKey: 'displayName',
    header: ({ table }) => <SavedItemHeader table={table} />,
    size: 200,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
    enableHiding: false,
    cell: ({ row, table }) => <SavedItemCell row={row} table={table} />,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => <DefaultHeader text='description' />,
    size: 300,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE * 1.5,
    cell: ({ getValue }) => <DefaultCell text={getValue() as string} />,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => <DefaultHeader text='created' />,
    size: 150,
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
    size: 200,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
    cell: ({ getValue }) => (
      <TagsCell tagList={getValue() as DataSourceTag[]} />
    ),
  },
]
