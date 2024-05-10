import { memo } from 'react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from 'reactflow'

import { Button } from '@/components/ui/button'

interface ButtonEdgeProps {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: any
  targetPosition: any
}

function ButtonEdge({ id, sourceX, sourceY, targetX, targetY }: ButtonEdgeProps) {
  const { setEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <Button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          variant='ghost'
          size='sm'
          onClick={() => setEdges((es) => es.filter((e) => e.id !== id))}
        >
          x
        </Button>
      </EdgeLabelRenderer>
    </>
  )
}

export const CustomEdge = memo(ButtonEdge)
