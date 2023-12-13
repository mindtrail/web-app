'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DefaultHeader } from '@/components/history/columns/defaultHeader'
import { DefaultCell } from '@/components/history/columns/defaultCell'
import { TagsCell } from '@/components/history/columns/tags'
import {
  WebsiteHeader,
  WebsiteCell,
} from '@/components/history/columns/website'

import { formatDate } from '@/lib/utils'

export const FIXED_COLUMNS = ['website']

export const columns: ColumnDef<HistoryItem>[] = [
  {
    id: 'website',
    accessorKey: 'displayName',
    header: ({ table }) => <WebsiteHeader table={table} />,
    size: 200,
    minSize: 150,
    maxSize: 400,
    enableHiding: false,
    cell: ({ row, table }) => <WebsiteCell row={row} table={table} />,
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
    id: 'summary',
    accessorKey: 'summary',
    header: () => <DefaultHeader text='summary' />,
    size: 350,
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

    // },
    // <DefaultCell text={getValue() as string} />,
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
