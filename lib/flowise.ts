export async function callFlowiseChat(question: string, socketIOClientId?: string) {
  const payload = {
    question: question,
    socketIOClientId,
  }
  const flowiseURL = process.env.FLOWISE_URL || ''

  const response = await fetch(flowiseURL, {
    headers: {
      Authorization: `Bearer ${process.env.FLOWISE_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const result = await response.json()
  return result
}
