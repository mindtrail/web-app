import { Node, Edge } from 'reactflow'

export const initialNodes: Node[] = [
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

export const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'customEdge' },
  { id: 'e1-3', source: '1', target: '3', type: 'customEdge' },
]

let id = 5
export const getNewNodeId = () => `${id++}`
