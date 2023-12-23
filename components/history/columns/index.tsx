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

export const FIXED_COLUMNS = ['saved-item']

export const columns: ColumnDef<HistoryItem>[] = [
  {
    id: 'saved-item',
    accessorKey: 'displayName',
    header: ({ table }) => <SavedItemHeader table={table} />,
    size: 200,
    minSize: 150,
    maxSize: 400,
    enableHiding: false,
    cell: ({ row, table }) => <SavedItemCell row={row} table={table} />,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: () => <DefaultHeader text='description' />,
    size: 300,
    minSize: 150,
    maxSize: 700,
    cell: ({ getValue }) => <DefaultCell text={getValue() as string} />,
  },
  {
    id: 'created',
    accessorKey: 'createdAt',
    header: () => <DefaultHeader text='created' />,
    size: 150,
    minSize: 100,
    maxSize: 200,
    cell: ({ getValue }) => (
      <DefaultCell text={formatDate(getValue() as string)} />
    ),
  },
  {
    id: 'tags',
    accessorKey: 'dataSourceTags',
    header: () => <DefaultHeader text='tags' />,
    size: 200,
    minSize: 100,
    maxSize: 300,
    cell: ({ getValue }) => (
      <TagsCell tagList={getValue() as DataSourceTag[]} />
    ),
  },
]
