import { ChatOpenAI } from 'langchain/chat_models/openai'
import { PromptTemplate } from 'langchain/prompts'
import { SystemMessage, HumanMessage, AIMessageChunk } from 'langchain/schema'

import { getTagList } from '@/lib/db/tags'

const SUMMARY_PROMPT = process.env.SUMMARY_PROMPT || ''
const GET_TAGS_PROMPT = process.env.GET_TAGS_PROMPT || ''

const tagsPromptTemplate = PromptTemplate.fromTemplate(GET_TAGS_PROMPT)

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

  const exsitingTags = (await getTagList()).map((tag) => tag.name)

  const formattedPrompt = await tagsPromptTemplate.format({
    categories: exsitingTags.join(', '),
  })

  // console.log(4444444, pageDescription, 55555, formattedPrompt)

  const systemMessage = new SystemMessage(formattedPrompt)
  const humanMessage = new HumanMessage(pageDescription)

  const response = (await openAI
    .call([systemMessage, humanMessage])
    .catch(console.error)) as AIMessageChunk

  if (!response?.content || response?.content === 'undefined') {
    return []
  }

  const tags = (response?.content as string)
    ?.split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length)

  return tags
}

export const summarizePage = async (text: string) => {
  const openAI = getOpenAIConnection()

  if (!text) {
    return ''
  }

  const humanMessage = new HumanMessage(text)
  const systemMessage = new SystemMessage(SUMMARY_PROMPT)

  const response = (await openAI
    .call([systemMessage, humanMessage])
    .catch(console.error)) as AIMessageChunk

  const summary = response?.content
  // console.log('SUMMARY ---- ---- --', summary)
  return summary as string
}
