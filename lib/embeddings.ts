import { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

export const createEmbeddings = (chunks: Document[]): Promise<number[][]> => {
  const openAIEmb = new OpenAIEmbeddings()
  const chunksContent = chunks.map((chunk) => chunk.pageContent)

  // return callOwnHFModel(chunksContent)
  return openAIEmb.embedDocuments(chunksContent)
}

// Hugging Face Model
const MODEL_URL =
  'https://o6bv59bgw9y2izmr.eu-west-1.aws.endpoints.huggingface.cloud'

// @TODO: use e5-base-v2 for English?
const E5_BASE = 'intfloat/multilingual-e5-base'

const callOwnHFModel = async (text: string | string[]): Promise<number[][]> => {
  let inputs: string[] = []
  if (typeof text === 'string') {
    inputs.push(text.replace(/\n/g, ' '))
  } else {
    inputs = text.map((t) => t.replace(/\n/g, ' '))
  }

  const payload = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACEHUB_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs }),
  }

  try {
    const response = await fetch(MODEL_URL, payload)
    if (!response.ok) {
      throw new Error(`HTTP request failed with status ${response.status}`)
    }
    const res = await response.json()
    // @ts-ignore
    return res.embeddings
  } catch (error) {
    console.error(error)
    return []
  }
}
