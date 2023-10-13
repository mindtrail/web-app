import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RetrievalQAChain } from 'langchain/chains'
import { AIMessage, SystemMessage, HumanMessage } from 'langchain/schema'
import { StreamingTextResponse, LangChainStream, Message } from 'ai'
import { QdrantVectorStore, QdrantLibArgs } from 'langchain/vectorstores/qdrant'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { Document } from 'langchain/document'
import { PromptTemplate } from 'langchain/prompts'

import { searchSimilarText } from '@/lib/db/dataStore'

const CHAT_SYSTEM = process.env.CHAT_SYSTEM || ''
const CHAT_PROMPT = process.env.CHAT_PROMPT || ''

const chatPrompt = PromptTemplate.fromTemplate(CHAT_PROMPT)

interface chatWithAI {
  messages: Message[]
  chatId: string
  userId: string
}

export async function callLangchainChat({
  messages,
  chatId,
  userId,
}: chatWithAI) {
  if (!messages) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  const lastMessage = messages[messages.length - 1].content
  const collectionName = `${userId}-${chatId}`

  const model = new ChatOpenAI({
    streaming: true,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  })
  // const chain = RetrievalQAChain.fromLLM(model)

  console.time('searchDB ---')
  const kbData = (await searchSimilarText(
    lastMessage,
    collectionName,
  )) as Document[]
  console.timeEnd('searchDB ---')

  console.log('kbData', kbData.length)

  if (!kbData?.length) {
    // return a plain text response
    return new Response(
      'Sorry, I could not find related information in your browsing history',
      {
        status: 200,
      },
    )
  }

  const sources = kbData.map(({ pageContent, metadata }) => {
    return {
      pageContent,
      fileName: metadata.fileName,
    }
  })

  const context = sources.map(({ pageContent }) => pageContent).join(' \n ')

  const formattedChatPrompt = await chatPrompt.format({
    question: lastMessage,
    context,
  })

  const systemMessage = new SystemMessage(CHAT_SYSTEM)
  const humanMessage = new HumanMessage(formattedChatPrompt)

  const { stream, handlers } = LangChainStream()
  const initialEndHandler = handlers.handleLLMEnd
  // Adding my own handler for chat completion
  handlers.handleLLMEnd = (message, runId) => {
    return initialEndHandler(message, runId)
  }

  const preparedMessages = (messages as Message[]).map(({ role, content }) =>
    role == 'user' ? new HumanMessage(content) : new AIMessage(content),
  )

  model
    .call(preparedMessages.concat([systemMessage, humanMessage]), {}, [
      handlers,
    ])
    .catch(console.error)

  return new StreamingTextResponse(stream)
}
