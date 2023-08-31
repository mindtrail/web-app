import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIMessage, HumanMessage } from 'langchain/schema'
import { StreamingTextResponse, LangChainStream, Message } from 'ai'

import { searchSimilarText } from '@/lib/db/dataStore'

interface chatWithAI {
  messages: Message[]
  chatId: string
  userId: string
}

export async function chatWithAI({ messages, chatId, userId }: chatWithAI) {
  if (!messages) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  const { stream, handlers } = LangChainStream()

  const lastMessage = messages[messages.length - 1].content
  const collectionName = `${userId}-${chatId}`

  console.time('searchDB')
  const kbData = await searchSimilarText(lastMessage, collectionName)
  console.timeEnd('searchDB')

  console.log('kbData', kbData.length)

  if (!kbData?.length) {
    // return a plain text response
    return new Response('Sorry, I could not find the required information in your Knowledge Base', {
      status: 200,
    })
  }

  const sources = kbData.map((item) => {
    const metadata = item?.metadata
    const file = metadata.fileName
    const page = metadata?.loc?.pageNumber

    return {
      file,
      page,
    }
  })

  console.time('ai init')
  const chat = new ChatOpenAI({
    streaming: true,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  })
  console.timeEnd('ai init')

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
