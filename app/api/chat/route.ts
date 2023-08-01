import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIMessage, HumanMessage } from 'langchain/schema'
import { StreamingTextResponse, LangChainStream } from 'ai'

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

  const textMessage = req.body
  if (!textMessage) {
    return new Response('No message provided', {
      status: 400,
    })
  }
  // @ts-ignore
  const payload = JSON.parse(textMessage) // this will be a string

  console.log(payload)
  const { messages } = payload
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

  type Message = {
    role: string
    content: string
  }

  chat
    .call(
      (messages as Message[]).map((m) =>
        m.role == 'user' ? new HumanMessage(m.content) : new AIMessage(m.content),
      ),
      {},
      [handlers],
    )
    .catch(console.error)

  return new StreamingTextResponse(stream)
}
