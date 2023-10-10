import { ChatOpenAI } from 'langchain/chat_models/openai'
import { SystemMessage, HumanMessage, AIMessageChunk } from 'langchain/schema'

const SUMMARY_PROMPT = process.env.SUMMARY_PROMPT || ''

let openAIChat: ChatOpenAI

export const getOpenAIConnection = () => {
  if (openAIChat) {
    return openAIChat
  }

  openAIChat = new ChatOpenAI({
    streaming: true,
    temperature: 0.3,
    modelName: 'gpt-3.5-turbo',
  })

  return openAIChat
}

export const sumarizePage = async (text: string) => {
  const openAI = getOpenAIConnection()

  const humanMessage = new HumanMessage(text)
  const systemMessage = new SystemMessage(SUMMARY_PROMPT)

  const response = (await openAI
    .call([systemMessage, humanMessage])
    .catch(console.error)) as AIMessageChunk

  const summary = response?.content
  return summary
}
