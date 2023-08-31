import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RetrievalQAChain } from 'langchain/chains'
import { AIMessage, HumanMessage } from 'langchain/schema'
import { StreamingTextResponse, LangChainStream, Message } from 'ai'
import { QdrantVectorStore, QdrantLibArgs } from 'langchain/vectorstores/qdrant'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { Document } from 'langchain/document'

import { searchSimilarText } from '@/lib/db/dataStore'

interface chatWithAI {
  messages: Message[]
  chatId: string
  userId: string
}

export async function callLangchainChat({ messages, chatId, userId }: chatWithAI) {
  if (!messages) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  const lastMessage = messages[messages.length - 1].content
  const collectionName = `${userId}-${chatId}`

  console.time('ai init')
  const model = new ChatOpenAI({
    streaming: true,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  })
  console.timeEnd('ai init')

  // const chain = RetrievalQAChain.fromLLM(model)

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

  const { stream, handlers } = LangChainStream()
  const initialEndHandler = handlers.handleLLMEnd

  // Adding my own handler for chat completion
  handlers.handleLLMEnd = (message, runId) => {
    console.log(sources)
    console.log(message)
    return initialEndHandler(message, runId)
  }

  model
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
