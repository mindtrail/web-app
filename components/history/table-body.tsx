import { memo, useCallback } from 'react'

import { Table as ReactTable, flexRender, Row } from '@tanstack/react-table'

import { TableBody, TableCell, TableRow } from '@/components/ui/table'

interface TableBodyProps {
  table: ReactTable<HistoryItem>
  entityIsHighlight: boolean
  setPreviewItem: (item: HistoryItem) => void
}

export function TableBodyComponent(props: TableBodyProps) {
  const { table, entityIsHighlight, setPreviewItem } = props

  const { flatRows: rows } = table.getRowModel()

  const handleRowClick = useCallback(
    (row: Row<HistoryItem>) => {
      const areRowsSelected =
        table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected()

      if (areRowsSelected) {
        row.toggleSelected()
      } else {
        setPreviewItem(row.original)
      }
    },
    [table, setPreviewItem],
  )

  if (!rows?.length) {
    return (
      <div className='flex w-full100%-10px) items-center justify-center py-10 text-foreground/70'>
        No Results
      </div>
    )
  }
  return (
    <TableBody>
      {rows?.map((row) => {
        const isRowSelected = row.getIsSelected()

        return (
          <TableRow
            key={row.id}
            onClick={() => handleRowClick(row)}
            data-state={isRowSelected && 'selected'}
            className={`group/row text-foreground/70 hover:text-foreground border-none
            ${isRowSelected && 'text-foreground'}`}
          >
            {row.getVisibleCells().map(({ id, column, getContext }) => {
              return (
                <TableCell
                  key={id}
                  className={`align-top
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
export const MemoizedTableBody = memo(
  TableBodyComponent,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody
