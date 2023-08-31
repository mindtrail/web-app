import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIMessage, HumanMessage } from 'langchain/schema'
import { getServerSession } from 'next-auth/next'
import { StreamingTextResponse, LangChainStream, Message } from 'ai'

import { authOptions } from '@/lib/authOptions'
import { chatWithAI } from '@/lib/langchain'

let openAIChat: ChatOpenAI

const getOpenAIConnection = () => {
  if (openAIChat) {
    return openAIChat
  }

  openAIChat = new ChatOpenAI({
    streaming: true,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  })

  return openAIChat
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const body = await req.json()

  const { messages, chatId } = body
  console.log('chatID ', chatId)

  if (!messages) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  return chatWithAI({ messages, chatId, userId })
}
