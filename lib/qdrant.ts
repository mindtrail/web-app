import { QdrantClient, Schemas } from '@qdrant/js-client-rest'
import { Document } from 'langchain/document'
import { QdrantVectorStore, QdrantLibArgs } from 'langchain/vectorstores/qdrant'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

const COLLECTION_CONFIG: Schemas['CreateCollection'] = {
  optimizers_config: {
    memmap_threshold: 10000,
  },
  vectors: {
    size: 1536,
    distance: 'Cosine',
  },
  on_disk_payload: true,
}

// @TODO: - create the UI and functionality for this
const DATASTORE_NAME = ''

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

export const createAndStoreVectors = async (props: CreateAndStoreVectors) => {
  const { docs, userId, dataStoreId, dataSrcId } = props

  const qdrantOptions = {
    collectionConfig: COLLECTION_CONFIG,
    collectionName: `${userId}-${dataStoreId}`,
  }

  const updatedDocs = docs.map((doc) => {
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

  const vectorStore = await QdrantVectorStore.fromDocuments(
    updatedDocs,
    new OpenAIEmbeddings(),
    qdrantOptions,
  )

  return vectorStore
}

export const searchSimilarText = async (message: string, collectionName: string) => {
  // const vectorStore = await QdrantVectorStore.fromExistingCollection(new OpenAIEmbeddings(), {
  // collectionName,
  // })
  //
  // console.log('message', message)
  //
  // const response = await vectorStore.similaritySearch(message, 5)

  const response = await searchDB(message, 5, collectionName)

  // console.log(response)
  return response
}

export const searchDB = async (searchQuery: string, limit: number = 5, collectionName: string) => {
  if (!searchQuery) {
    return ''
  }

  const openAIEmb = new OpenAIEmbeddings()
  const embeddings = await openAIEmb.embedDocuments([searchQuery])

  const qdrantClient = getQdrantConnection()
  const results = await qdrantClient.search(collectionName, {
    vector: embeddings[0],
    limit,
  })

  const result: Document[] = (results as QdrantSearchResponse[]).map((res) => {
    console.log(res.score, res)

    return new Document({
      metadata: res.payload.metadata,
      pageContent: res.payload.content,
    })
  })

  return result
}

let qdrantClient: QdrantClient
// Create a singleton instance of the QdrantClient

const getQdrantConnection = () => {
  if (qdrantClient) {
    console.log('Using existing connection - 111 --- 111 --')
    return qdrantClient
  }

  qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  })
  return qdrantClient
}

export const updatePayload = async (
  collectionName: string = 'first-collection-6kjTOdAdPf-4noUduqb8r',
) => {
  const qdrantClient = getQdrantConnection()

  // First gett all points that have "originalfile" set in their payload metadata
  const points = await qdrantClient.scroll(collectionName, {
    filter: {
      must_not: [{ key: 'metadata.originalname', match: { value: 'ala-bala-portocala' } }],
    },
  })

  console.log('Points:', points)

  const currentCollection = await qdrantClient.getCollection(collectionName)
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
