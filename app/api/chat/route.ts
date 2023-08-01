import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIMessage, HumanMessage } from 'langchain/schema'

import { StreamingTextResponse, LangChainStream, Message } from 'ai'

import { authOptions } from '@/lib/authOptions'
import { searchSimilarText } from '@/lib/datastore'

export async function POST(req: Request, res: NextResponse) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }
  // @ts-ignore - userId is not in the session type but I added it
  const userId = session.user?.id

  const { messages } = await req.json()

  console.log('messages', messages)
  if (!messages) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  const lastMessage = messages[messages.length - 1].content

  console.time('searchDB')
  const kbData = await searchSimilarText(lastMessage, userId)
  console.timeEnd('searchDB')

  // console.log('kbData', kbData)
  const sources = kbData.map((item) => {
    const metadata = item?.metadata
    const file = metadata.fileName
    const page = metadata?.loc?.pageNumber

    return {
      file,
      page,
    }
  })

  const { stream, handlers } = LangChainStream()

  const chat = new ChatOpenAI({
    streaming: true,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  })

  chat
    .call(
      (messages as Message[]).map(({ role, content }) =>
        role == 'user' ? new HumanMessage(content) : new AIMessage(content),
      ),
      {},
      [handlers],
    )
    .catch(console.error)

  return new StreamingTextResponse(stream)
}
