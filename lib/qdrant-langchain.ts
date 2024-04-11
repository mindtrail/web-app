import { QdrantClient, Schemas } from '@qdrant/js-client-rest'
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
  // on_disk_payload: true, // @TODO" test for improved performance without this
}

const QDRANT_ARGS: QdrantLibArgs = {
  collectionConfig: COLLECTION_CONFIG,
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

  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    ...QDRANT_ARGS,
    collectionName: QDRANT_COLLECTION,
  })

  const result = await vectorStore.addDocuments(docs)
  return result
}

export const searchSimilarText = async (
  message: string,
  returnDoc: boolean = false,
): Promise<string[]> => {
  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    collectionName: QDRANT_COLLECTION,
  })

  // console.time('search')
  const allChunks = await vectorStore.similaritySearchWithScore(message, 10)
  // console.timeEnd('search')

  const docs = allChunks
    .filter(([_, similarityScore]) => similarityScore > SIMILARITY_THRESHOLD)
    .map(([chunk]) => chunk)

  const dataSourceIdList = getDataSourcesOrderByNrOfHits(docs)

  if (returnDoc) {
    // @ts-ignore
    return docs
  }

  return dataSourceIdList
}

export const deleteVectorsForDataSource = async (dataSourceIdList: string[]) => {
  if (!dataSourceIdList?.length) {
    return
  }

  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    collectionName: QDRANT_COLLECTION,
  })

  const deleteFilter = {
    must: [
      {
        key: 'metadata.dataSourceId',
        match: {
          any: dataSourceIdList,
        },
      },
    ],
  }

  const res = await vectorStore.client.delete(QDRANT_COLLECTION, {
    filter: deleteFilter,
  })

  return res
}

function getDataSourcesOrderByNrOfHits(documentsArray: Document[]): string[] {
  const websitesFound: { [key: string]: number } = {}

  for (const doc of documentsArray) {
    const { dataSourceId } = doc.metadata
    websitesFound[dataSourceId] = websitesFound[dataSourceId] || 0
    websitesFound[dataSourceId]++
  }

  // Sort the websitesFound object by the number of hits
  const sortedWebsitesFound = Object.entries(websitesFound)
    .sort(([, a], [, b]) => b - a)
    .map(([website]) => website)

  return sortedWebsitesFound
}
