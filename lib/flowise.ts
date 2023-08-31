interface FlowiseChat {
  question: string
  config?: Object
  flowiseURL: string
}

export async function callFlowiseChat({ question, config, flowiseURL }: FlowiseChat) {
  const payload = {
    question,
    overrideConfig: config,
  }

  console.log('-- payload --- ', payload)

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
