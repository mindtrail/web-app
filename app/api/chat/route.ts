import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { callLangchainChat } from '@/lib/langchain'
import { callFlowiseChat } from '@/lib/flowise'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const body = await req.json()

  const { messages, chatId, flowiseURL } = body
  console.log('chatID ', chatId)
  console.log('flowiseURL ', flowiseURL)


  if (flowiseURL) {
    console.log('000', messages)

    const payload = {
      question: messages[messages.length - 1].content,
      overrideConfig: {
        qdrantCollection: `${userId}-${chatId}`
      },
      flowiseURL
    }

    const result = await callFlowiseChat(payload)

    console.log('--- flowise --- ', result)
    return new Response(result.text, {
      status: 200,
    })
  }

  if (!messages) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  try {
    return callLangchainChat({ messages, chatId, userId })
  } catch (error) {
    console.error('An error occurred:', error)

    return new Response('Server Error', {
      status: 500,
    })
  }
}
