import { QdrantClient, Schemas } from '@qdrant/js-client-rest'
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
  // on_disk_payload: true, // @TODO" test for improved performance without this
}

const QDRANT_CLIENT_PROPS: QdrantLibArgs = {
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
}

const QDRANT_ARGS: QdrantLibArgs = {
  client: new QdrantClient(QDRANT_CLIENT_PROPS),
  collectionConfig: COLLECTION_CONFIG,
}

interface CreateAndStoreVectors {
  docs: Document[]
  userId: string
  dataStoreId: string
  dataSrcId: string
}

type QdrantSearchResponse = Schemas['ScoredPoint'] & {
  payload: {
    metadata: object
    content: string
  }
}

export const getVectorStore = (collectionName: string) => {
  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    ...QDRANT_ARGS,
    collectionName,
  })
}

export const createAndStoreVectors = async (props: CreateAndStoreVectors) => {
  const { docs, userId, dataStoreId, dataSrcId } = props

  const collectionName = `${userId}-${dataStoreId}`

  const payload = docs.map((doc) => {
    const { pageContent, metadata } = doc
    return {
      pageContent,
      metadata: {
        ...metadata,
        dataStoreId,
        dataSrcId,
        userId,
      },
    }
  })

  const store = await QdrantVectorStore.fromDocuments(payload, new OpenAIEmbeddings(), {
    ...QDRANT_ARGS,
    collectionName,
  })

  store.asRetriever()

  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    ...QDRANT_ARGS,
    collectionName,
  })
  const result = await vectorStore.addDocuments(payload)

  return result
}

export const searchSimilarText = async (
  message: string,
  collectionName: string,
): Promise<Document[]> => {
  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    ...QDRANT_ARGS,
    collectionName,
  })

  console.log('--- message ---', message)

  const result = await vectorStore.similaritySearchWithScore(message, 5)
  return result.filter(([_doc, score]) => score > SIMILARITY_THRESHOLD).map(([doc]) => doc)
}

export const getCollections = async () => {
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  })

  const result = await client.getCollections()
  console.log('List of collections:', result.collections)
  return result.collections
}
