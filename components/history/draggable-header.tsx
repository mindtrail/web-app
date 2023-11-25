'use client'

import { useDrag, useDrop } from 'react-dnd'
import {
  Column,
  ColumnOrderState,
  Header,
  Table,
  flexRender,
} from '@tanstack/react-table'

import { TableHead } from '@/components/ui/table'

interface DraggableHeaderProps<HistoryItem, TValue> {
  header: Header<HistoryItem, TValue>
  table: Table<HistoryItem>
  index: number
}

export function DraggableHeader<TData, TValue>({
  header,
  table,
  index,
}: DraggableHeaderProps<TData, TValue>) {
  const { getState, setColumnOrder } = table
  const { columnOrder } = getState()
  const { column } = header

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<HistoryItem>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder,
      )
      setColumnOrder(newColumnOrder)
    },
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  })

  return (
    <>
      <TableHead
        ref={dropRef}
        key={header.id}
        className={`${isDragging ? 'opacity-50' : ''}
          ${
            index === 0
              ? 'w-12'
              : index === 2
              ? 'w-[35%]'
              : index === 4
              ? 'w-16'
              : ''
          }`}
      >
        <div ref={previewRef} className={`${isDragging ? 'bg-red-600' : ''}`}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          <button ref={dragRef}>🟰</button>
        </div>
      </TableHead>
      {/* <th
        ref={dropRef}
        colSpan={header.colSpan}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <div ref={previewRef}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          <button ref={dragRef}>🟰</button>
        </div>
      </th> */}
    </>
  )
}

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[],
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string,
  )
  return [...columnOrder]
}
