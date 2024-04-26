import { memo } from 'react'
import { getBezierPath, EdgeText, useReactFlow } from 'reactflow'

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

function ButtonEdge(props: ButtonEdgeProps) {
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
      {data && data?.label && (
        <EdgeText
          x={sourceX + 10}
          y={sourceY + 10}
          label={data.label}
          labelStyle={{ fill: 'black' }}
          labelBgStyle={{ fill: 'transparent' }}
          labelBgPadding={[2, 4]}
          labelBgBorderRadius={2}
        />
      )}
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

export const CustomEdge = memo(ButtonEdge)
