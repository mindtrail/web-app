import { Schemas } from '@qdrant/js-client-rest'
import { Document } from 'langchain/document'
import { QdrantVectorStore, QdrantLibArgs } from 'langchain/vectorstores/qdrant'

import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

const SIMILARITY_THRESHOLD = 0.78
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || ''

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
  collectionName: QDRANT_COLLECTION,
}

interface CreateAndStoreVectors {
  docs: Document[]
}

type QdrantSearchResponse = Schemas['ScoredPoint'] & {
  payload: {
    metadata: object
    content: string
  }
}

export const createAndStoreVectors = async (props: CreateAndStoreVectors) => {
  const { docs } = props

  const vectorStore = await QdrantVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
    {
      ...QDRANT_CLIENT_PROPS,
      collectionConfig: COLLECTION_CONFIG,
    },
  )
}

export const searchSimilarText = async (message: string): Promise<string[]> => {
  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    collectionName: QDRANT_COLLECTION,
  })

  const allChunks = await vectorStore.similaritySearch(message, 10)
  const dataSourceList = getDataSourcesOrderByNrOfHits(allChunks)

  return dataSourceList
}

function getDataSourcesOrderByNrOfHits(dataArray: Document[]): string[] {
  // dataSourceId: string

  const websitesFound: { [key: string]: number } = {}

  for (const data of dataArray) {
    const { dataSourceId } = data.metadata
    websitesFound[dataSourceId]++
  }

  // Sort the websitesFound object by the number of hits
  const sortedWebsitesFound = Object.entries(websitesFound)
    .sort(([, a], [, b]) => b - a)
    .map(([website]) => website)

  return sortedWebsitesFound
}
