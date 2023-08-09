import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIMessage, HumanMessage } from 'langchain/schema'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { StreamingTextResponse, LangChainStream, Message } from 'ai'

import { searchSimilarText } from '@/lib/data-store'

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
  console.time('session')
  const session = await getServerSession(authOptions)
  console.timeEnd('session')

  if (!session?.user) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }
  // @ts-ignore - userId is not in the session type but I added it
  // const userId = session.user?.id

  const { messages } = await req.json()

  // console.log('messages', messages)
  if (!messages) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  // const lastMessage = messages[messages.length - 1].content

  // console.time('searchDB')
  // const kbData = await searchSimilarText(lastMessage, userId)
  // console.timeEnd('searchDB')

  // console.log('kbData', kbData)
  // const sources = kbData.map((item) => {
  //   const metadata = item?.metadata
  //   const file = metadata.fileName
  //   const page = metadata?.loc?.pageNumber

  //   return {
  //     file,
  //     page,
  //   }
  // })

  const { stream, handlers } = LangChainStream()

  console.time('ai')
  const chat = getOpenAIConnection()
  console.timeEnd('ai')

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
