'use client'
import 'reactflow/dist/style.css'

import { useCallback, useState, useEffect, useRef } from 'react'
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ConnectionLineType,
  useReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  SelectionMode,
  type OnConnectStart,
  type OnConnectEnd,
} from 'reactflow'

import { getFlows, onFlowsChange, deleteFlow, updateFlow } from '@/lib/db/flows'

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
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [flows, setFlows] = useState<Flow[]>([])

  const { screenToFlowPosition } = useReactFlow()

  useEffect(() => {
    const fetchFlows = async () => {
      const res = await getFlows()
      const data = (res.data as Flow[]) || []

      setFlows(data)
    }
    fetchFlows()
    return onFlowsChange(fetchFlows)
  }, [])

  useEffect(() => {
    if (flows.length === 0) return

    const firstFlow = flows[0]
    const { events } = firstFlow

    // console.log('flows changed', flows, events)

    if (!events || events.length === 0) return

    const newNodes: Node[] = []
    const newEdges: Edge[] = []
    let lastNodeId: string | null = null
    let yPos = 0

    events.forEach((event: FlowEvent, index: number) => {
      const nodeId = `event-${index}`
      newNodes.push({
        id: nodeId,
        data: { label: `${index + 1}: ${event.event_name}` },
        position: { x: 100, y: yPos },
      })

      if (lastNodeId) {
        newEdges.push({
          id: `e${lastNodeId}-${nodeId}`,
          source: lastNodeId,
          target: nodeId,
          type: 'custom-edge',
        })
      }

      lastNodeId = nodeId
      yPos += 100
    })
    console.log(newNodes, newEdges)

    setNodes((currentNodes) => [...currentNodes, ...newNodes])
    setEdges((currentEdges) => [...currentEdges, ...newEdges])
  }, [flows, setEdges, setNodes])

  // Reactflow functions
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
