import { Schemas } from '@qdrant/js-client-rest'
import { Document } from 'langchain/document'
import { QdrantVectorStore, QdrantLibArgs } from 'langchain/vectorstores/qdrant'

import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

const SIMILARITY_THRESHOLD = 0.78

const COLLECTION_CONFIG: Schemas['CreateCollection'] = {
  optimizers_config: {
    memmap_threshold: 10000,
  },
  vectors: {
    size: 1536,
    distance: 'Cosine',
  },
}

const QDRANT_CLIENT_PROPS: QdrantLibArgs = {
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
}

interface CreateAndStoreVectors {
  docs: Document[]
  collectionName: string
}

type QdrantSearchResponse = Schemas['ScoredPoint'] & {
  payload: {
    metadata: object
    content: string
  }
}

export const createAndStoreVectors = async (props: CreateAndStoreVectors) => {
  const { docs, collectionName } = props

  const vectorStore = await QdrantVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
    {
      ...QDRANT_CLIENT_PROPS,
      collectionName,
      collectionConfig: COLLECTION_CONFIG,
    },
  )
}

export const searchSimilarText = async (
  message: string,
  collectionName: string,
): Promise<Document['metadata'] | undefined> => {
  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    collectionName,
  })

  console.log('--- message ---', message)

  const allChunks = await vectorStore.similaritySearch(message, 10)
  const website = getWebsiteWithMostHits(allChunks)

  return website
}

function getWebsiteWithMostHits(
  dataArray: Document[],
): Document['metadata'] | undefined {
  const fileNameCounts: { [key: string]: number } = {}
  let maxCount = 0
  let websiteWithMostHits

  for (const data of dataArray) {
    const fileName = data.metadata.fileName
    fileNameCounts[fileName] = (fileNameCounts[fileName] || 0) + 1
    if (fileNameCounts[fileName] > maxCount) {
      maxCount = fileNameCounts[fileName]
      websiteWithMostHits = data.metadata as Document['metadata']
    }
  }

  return websiteWithMostHits
}
