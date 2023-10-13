import { ChatOpenAI } from 'langchain/chat_models/openai'
import { SystemMessage, HumanMessage, AIMessageChunk } from 'langchain/schema'

const SUMMARY_PROMPT = process.env.SUMMARY_PROMPT || ''
const CATEGORY_PROMPT = process.env.CATEGORY_PROMPT || ''

const EXISTING_CATEGORIES = [
  'tools',
  'RAG',
  'AI',
  'library',
  'low-code',
  'saas',
  'design-tools',
  'saas',
  'npm-package',
  'framework',
  'browser-extensions',
  'react',
  'nextjs',
  'framework',
  'coffee',
  'espresso',
  'ai',
  'foundation-models',
]

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

export const getPageCategory = async (text: string) => {
  const openAI = getOpenAIConnection()

  const humanMessage = new HumanMessage(text)
  const systemMessage = new SystemMessage(CATEGORY_PROMPT)

  const response = (await openAI
    .call([systemMessage, humanMessage])
    .catch(console.error)) as AIMessageChunk

  const category = response?.content
  return category
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
