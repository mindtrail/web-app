import { memo, CSSProperties } from 'react'
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow'

const sourceHandleStyleA: CSSProperties = { left: 50 }
const sourceHandleStyleB: CSSProperties = {
  right: 50,
  left: 'auto',
}

function NewNode({ data, xPos, yPos }: NodeProps) {
  return (
    <>
      <NodeResizer />
      <Handle type='target' position={Position.Top} />
      <div>
        <strong>{data.label}</strong>
      </div>

      {/* <Handle type='source' position={Position.Left} id='a' style={sourceHandleStyleA} /> */}
      {/* <Handle type='source' position={Position.Right} id='b' style={sourceHandleStyleB} /> */}
    </>
  )
}

export const CustomNode = memo(NewNode)
