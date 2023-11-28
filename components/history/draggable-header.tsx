'use client'

import { useMemo, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

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

export const FIXED_COLUMNS = ['select', 'actions']
const DRAG_ITEM_TYPE = 'column'

export function DraggableHeader<TData, TValue>({
  header,
  table,
  index,
}: DraggableHeaderProps<TData, TValue>) {
  const { getState, setColumnOrder } = table
  const { columnOrder } = getState()
  const { column } = header

  const draggableColumn = useMemo(
    () => !FIXED_COLUMNS.includes(column.id),
    [column],
  )

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    item: () => column,
    type: DRAG_ITEM_TYPE,
    canDrag: () => draggableColumn,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, dropRef] = useDrop({
    accept: DRAG_ITEM_TYPE,
    canDrop: () => draggableColumn,
    drop: (draggedColumn: Column<HistoryItem>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder,
      )
      setColumnOrder(newColumnOrder)
    },
  })

  useEffect(() => {
    previewRef(getEmptyImage(), { captureDraggingState: true })
  }, [previewRef])

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
        <div className={`flex items-center group`} ref={dragRef}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}

          {draggableColumn && (
            <Button
              variant='ghost'
              className={`px-2 invisible group-hover:visible cursor-grab`}
            >
              <DragHandleDots2Icon />
            </Button>
          )}
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
  if (draggedColumnId === targetColumnId) {
    return columnOrder
  }

  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string,
  )
  console.log(columnOrder)
  return [...columnOrder]
}
