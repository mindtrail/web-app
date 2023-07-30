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

type QdrantSearchResponse = Schemas['ScoredPoint'] & {
  payload: {
    metadata: object
    content: string
  }
}

const TEST_COLLECTION = 'test-collection'

// The env variables are taken by QdrantVectorStore from the .env file
const QDRANT_OPTIONS: QdrantLibArgs = {
  collectionName: TEST_COLLECTION,
  collectionConfig: COLLECTION_CONFIG,
}

export const createAndStoreVectors = async (docs: Document[]) => {
  const vectorStore = await QdrantVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings(),
    QDRANT_OPTIONS,
  )

  return vectorStore
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

const createCollection = async (name: string) => {
  const qdrantClient = getQdrantConnection()

  // @Todo - create unique collection name per user
  const collectionName = name

  try {
    const result = await qdrantClient.createCollection(collectionName, { ...COLLECTION_CONFIG })
    console.log('Collection created:', result)
    return result
  } catch (err) {}
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

export const searchDB = async (searchQuery: string, limit: number = 5) => {
  if (!searchQuery) {
    return ''
  }

  const openAIEmb = new OpenAIEmbeddings()
  const embeddings = await openAIEmb.embedDocuments([searchQuery])
  const collectionName = TEST_COLLECTION

  const qdrantClient = getQdrantConnection()
  const results = await qdrantClient.search(collectionName, {
    vector: embeddings[0],
    limit,
  })

  const result: Document[] = (results as QdrantSearchResponse[]).map((res) => {
    console.log(res.score)

    return new Document({
      metadata: res.payload.metadata,
      pageContent: res.payload.content,
    })
  })

  return result
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
