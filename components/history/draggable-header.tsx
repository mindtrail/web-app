'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import { Separator } from '@/components/ui/separator'
import {
  Column,
  ColumnOrderState,
  Header,
  Table,
  flexRender,
} from '@tanstack/react-table'

import { TableHead } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

import { FIXED_COLUMNS, DRAG_ITEM_TYPE } from '@/lib/constants'

interface DraggableHeaderProps<HistoryItem, TValue> {
  header: Header<HistoryItem, TValue>
  table: Table<HistoryItem>
  updateUserPreferences: (prefs: UserTablePrefs) => void
}

type DropIndicator = 'left' | 'right' | null

export function DraggableHeader<TData, TValue>({
  header,
  table,
  updateUserPreferences,
}: DraggableHeaderProps<TData, TValue>) {
  const { getState, setColumnOrder } = table

  const [dropIndicator, setDropIndicator] = useState<DropIndicator>(null)
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

  const [{ isOver, item }, dropRef] = useDrop({
    accept: DRAG_ITEM_TYPE,
    canDrop: () => draggableColumn,
    drop: (draggedColumn: Column<HistoryItem>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder,
      )

      if (!newColumnOrder) {
        return
      }

      setColumnOrder(newColumnOrder)

      updateUserPreferences({
        columnOrder: newColumnOrder,
      })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      item: monitor.getItem(),
    }),
  })

  useEffect(() => {
    if (!isOver || !draggableColumn) {
      setDropIndicator(null)
      return
    }

    const draggedColumnIndex = columnOrder.indexOf(item.id)
    const targetColumnIndex = columnOrder.indexOf(column.id)

    if (draggedColumnIndex === targetColumnIndex) {
      return
    }

    setDropIndicator(draggedColumnIndex > targetColumnIndex ? 'left' : 'right')
  }, [isOver, dropRef, column, item, columnOrder, draggableColumn])

  useEffect(() => {
    previewRef(getEmptyImage(), { captureDraggingState: true })
  }, [previewRef])

  const isResizing = column.getIsResizing()

  const updatePreferences = useCallback(() => {
    // I need to get all the columns sizes for the table so that I keep the DB in sync
    const columnSize = table
      .getAllFlatColumns()
      .reduce((acc, column) => ({ ...acc, [column.id]: column.getSize() }), {})

    updateUserPreferences({
      columnSize,
    })
  }, [table, updateUserPreferences])

  return (
    <>
      <TableHead
        ref={dropRef}
        key={header.id}
        className={`relative ${isDragging ? 'opacity-50' : ''}`}
        style={{ width: header.getSize() }}
      >
        <div className={`flex items-center group `} ref={dragRef}>
          {header.isPlaceholder
            ? null
            : flexRender(column.columnDef.header, header.getContext())}

          {draggableColumn && (
            <Button
              variant='ghost'
              className={`px-2 invisible group-hover:visible cursor-grab`}
            >
              <DragHandleDots2Icon />
            </Button>
          )}
          {dropIndicator && (
            <Separator
              orientation='vertical'
              className={`absolute w-[2px] h-[70%] bg-primary rounded-lg ${dropIndicator}-0`}
            />
          )}
        </div>
        <div
          onMouseDown={header.getResizeHandler()}
          onMouseUp={updatePreferences}
          className={`group absolute flex justify-center items-center w-4
            -right-2 top-0 h-[100%] cursor-col-resize select-none touch-none mx-1`}
        >
          <Separator
            orientation='vertical'
            className={`w-[2px] bg-primary opacity-0 group-hover:opacity-100 h-[70%] rounded-lg
              ${isResizing && 'opacity-100'}`}
          />
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

  return [...columnOrder]
}
