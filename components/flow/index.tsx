'use client'
import 'reactflow/dist/style.css'

import { useCallback, useRef } from 'react'
import ReactFlow, {
  Node,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ConnectionLineType,
  Position,
  useReactFlow,
  type OnConnectStart,
  type OnConnectEnd,
  ReactFlowProvider,
} from 'reactflow'

import CustomNode from './custom-node'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    // sourcePosition: Position.Right,
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    // sourcePosition: Position.Right,
    // targetPosition: Position.Left,
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    // sourcePosition: Position.Right,
    // targetPosition: Position.Left,
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    type: 'custom',
    className: 'border p-4 w-32 rounded',
  },
]
let id = 6
const getId = () => `${id++}`

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
]

const nodeTypes = {
  custom: CustomNode,
}

const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
}

export function FlowComponent() {
  const connectingNodeId = useRef<string | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const { screenToFlowPosition } = useReactFlow()

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // reset the start node on connections
      connectingNodeId.current = null
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  )

  const onConnectStart = useCallback<OnConnectStart>((_, { nodeId }) => {
    connectingNodeId.current = nodeId
  }, [])

  const onConnectEnd = useCallback<OnConnectEnd>(
    (event) => {
      if (!connectingNodeId.current || !event?.target) return

      const targetIsPane = (event.target as HTMLElement)?.classList?.contains(
        'react-flow__pane',
      )

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const point =
          event instanceof MouseEvent
            ? { x: event.clientX, y: event.clientY }
            : { x: event.touches[0].clientX, y: event.touches[0].clientY }

        const id = getId()
        const newNode = {
          id,
          position: screenToFlowPosition(point),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        }

        setNodes((nds) => nds.concat(newNode))
        setEdges((eds) =>
          eds.concat([
            {
              id: `e${id}-${connectingNodeId.current}`,
              source: connectingNodeId.current || '',
              target: id,
            },
          ]),
        )
      }
    },
    [screenToFlowPosition, setNodes, setEdges],
  )

  return (
    <div className={'grow text-sm'}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      />
    </div>
  )
}

// wrapping with ReactFlowProvider is done outside of the component
export function FlowWithProvider(props: any) {
  return (
    <ReactFlowProvider>
      <FlowComponent {...props} />
    </ReactFlowProvider>
  )
}
