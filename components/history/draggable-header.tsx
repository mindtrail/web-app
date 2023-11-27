'use client'

import { useDrag, useDrop } from 'react-dnd'
import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import {
  Column,
  ColumnOrderState,
  Header,
  Table,
  flexRender,
} from '@tanstack/react-table'

import { TableHead } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface DraggableHeaderProps<HistoryItem, TValue> {
  header: Header<HistoryItem, TValue>
  table: Table<HistoryItem>
  index: number
}

const FIXED_COLUMNS = ['select', 'actions']

export function DraggableHeader<TData, TValue>({
  header,
  table,
  index,
}: DraggableHeaderProps<TData, TValue>) {
  const { getState, setColumnOrder } = table
  const { columnOrder } = getState()
  const { column } = header

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    item: () => column,
    type: 'column',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !FIXED_COLUMNS.includes(column.id),
  })

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
    canDrop: () => !FIXED_COLUMNS.includes(column.id),
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
        <div className={`flex items-center group`}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}

          <Button
            ref={dragRef}
            variant='ghost'
            className={`px-2 invisible group-hover:visible cursor-grab ${
              FIXED_COLUMNS.includes(column.id) ? 'hidden' : ''
            }`}
          >
            <DragHandleDots2Icon />
          </Button>
        </div>
      </TableHead>
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
  console.log(columnOrder)
  return [...columnOrder]
}
