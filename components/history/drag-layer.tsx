import type { CSSProperties, FC } from 'react'
import type { XYCoord } from 'react-dnd'
import { useDragLayer } from 'react-dnd'

import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

export const ColumnDragLayer = () => {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
    }),
  )

  if (!isDragging || !item) {
    // return null
  }

  return (
    <div
      className={`fixed pointer-events-none z-50 left-0 top-0 h-10 px-2 flex items-center text-sm font-medium text-muted-foreground bg-white rounded-sm`}
      style={getItemStyles(initialOffset, currentOffset)}
    >
      {item?.columnDef?.header}
      <Button variant='ghost' className={`px-2 cursor-grabbing`}>
        <DragHandleDots2Icon />
      </Button>
    </div>
  )
}

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
) {
  if (initialOffset == null || currentOffset == null) {
    return {
      display: 'none',
    }
  }

  let { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}
