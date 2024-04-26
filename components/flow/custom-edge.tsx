import { memo, useCallback } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeText,
  getBezierPath,
  useReactFlow,
} from 'reactflow'

import { Button } from '@/components/ui/button'

const foreignObjectSize = 40

interface ButtonEdgeProps {
  id: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: any
  targetPosition: any
  style: object
  data: object
  markerEnd: any
}

function ButtonEdge1(props: ButtonEdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    markerEnd,
  } = props

  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const { deleteElements } = useReactFlow()

  const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement>, id: string) => {
    console.log(333, evt, id)
    if (!id) return

    evt.stopPropagation()
    deleteElements({ edges: [{ id }] })
  }
  console.log(444, data)
  return (
    <>
      <path
        id={id}
        style={style}
        className='react-flow__edge-path'
        d={edgePath}
        markerEnd={markerEnd}
      />

      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className='edgebutton-foreignobject'
        requiredExtensions='http://www.w3.org/1999/xhtml'
      >
        <div>
          <button className='edgebutton' onClick={(event) => onEdgeClick(event, id)}>
            ×
          </button>
        </div>
      </foreignObject>
    </>
  )
}

function ButtonEdge({ id, sourceX, sourceY, targetX, targetY, data }: ButtonEdgeProps) {
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
