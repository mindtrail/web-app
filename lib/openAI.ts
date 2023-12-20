import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { SystemMessage, HumanMessage, AIMessageChunk } from 'langchain/schema'

const SUMMARY_PROMPT = process.env.SUMMARY_PROMPT || ''
const GET_TAGS_PROMPT = process.env.GET_TAGS_PROMPT || ''

const tagsPromptTemplate = PromptTemplate.fromTemplate(GET_TAGS_PROMPT)

const EXISTING_TAGS = [
  'utils',
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
  'langchain',
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

export const getPageTags = async (
  pageDescription: string,
): Promise<string[]> => {
  const openAI = getOpenAIConnection()

  const formattedPrompt = await tagsPromptTemplate.format({
    tags: EXISTING_TAGS.join(', '),
  })

  const systemMessage = new SystemMessage(formattedPrompt)
  const humanMessage = new HumanMessage(pageDescription)

  const response = (await openAI
    .call([systemMessage, humanMessage])
    .catch(console.error)) as AIMessageChunk

  // console.log('AI TAGS ---- ---- --', response?.content)

  if (!response?.content || response?.content === 'undefined') {
    return []
  }

  const tags = (response?.content as string)
    ?.split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length)

  return tags
}

export const sumarizePage = async (text: string) => {
  const openAI = getOpenAIConnection()

  const humanMessage = new HumanMessage(text)
  const systemMessage = new SystemMessage(SUMMARY_PROMPT)

  const response = (await openAI
    .call([systemMessage, humanMessage])
    .catch(console.error)) as AIMessageChunk

  const summary = response?.content
  // console.log('SUMMARY ---- ---- --', summary)
  return summary as string
}
