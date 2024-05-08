import {} from '@prisma/client'

declare global {
  // globalState.ts
  type Flow = {
    id: string
    created_at: string
    description: string
    name: string
    events: FlowEvent[]
  }

  type FlowEvent = {
    id: string
    delay: number
    name: string
    selector: string
    textContent: string
    type: string
    value: string | undefined
    event_name: string
    event_description: string
  }
}

const mock_event = {
  id: Date.now(),
  delay: 0,
  name: '',
  selector: 'label > button',
  textContent: 'BUTTON',
  type: 'click',
  value: undefined,
}
