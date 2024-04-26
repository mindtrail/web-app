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
  useReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  SelectionMode,
  type OnConnectStart,
  type OnConnectEnd,
} from 'reactflow'

import { CustomNode } from './custom-node'
import { CustomEdge } from './custom-edge'
import { getNewNodeId, initialNodes, initialEdges } from './utils'

const nodeTypes = {
  custom: CustomNode,
}
const edgeTypes = {
  'custom-edge': CustomEdge,
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

        const id = getNewNodeId()
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
    <div className={'grow text-sm relative'}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        selectionMode={SelectionMode.Partial}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
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
