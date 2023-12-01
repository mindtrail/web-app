import { QdrantClient, Schemas } from '@qdrant/js-client-rest'
import { Document } from 'langchain/document'
import { QdrantVectorStore, QdrantLibArgs } from 'langchain/vectorstores/qdrant'
import { DataSrc } from '@prisma/client'

import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { metadata } from '@/app/layout'

const DEFAULT_COLLECTION = 'bookmark-ai'
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
    metadata: {
      metaDescription: string
      pageTitle: string
      hostName: string
    }
    content: string
  }
}

type QueryPointsResponse = Schemas['ScrollResult']

export const getVectorStore = (collectionName: string) => {
  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    ...QDRANT_ARGS,
    collectionName,
  })
}

export const createAndStoreVectors = async (props: CreateAndStoreVectors) => {
  const { docs, userId, dataStoreId, dataSrcId } = props

  const collectionName = `bookmark-ai`

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
    collectionName: 'bookmark-ai',
  })

  const result = await vectorStore.similaritySearchWithScore(message, 10)

  const NR_OF_SOURCES = 3

  return result
    .filter(([_doc, score], index) => {
      return score > SIMILARITY_THRESHOLD
    })
    .sort(([_docA, scoreA], [_docB, scoreB]) => scoreB - scoreA)
    .splice(0, NR_OF_SOURCES)
    .map(([doc]) => doc)
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

export const getVectorItemsByDataSrcId = async (
  dataSrcIdList: string[],
  collectionName?: string,
): Promise<[] | undefined> => {
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  })

  if (!dataSrcIdList?.length) {
    return
  }

  try {
    console.time('getVectorItemsByDataSrcId')
    const result = {}

    await Promise.all(
      dataSrcIdList.map(async (dataSrcId) => {
        const { points } = await client.scroll(DEFAULT_COLLECTION, {
          filter: {
            must: [
              {
                key: 'metadata.dataSrcId',
                match: {
                  value: dataSrcId,
                },
              },
            ],
          },
          limit: 1,
          with_payload: ['metadata'],
          with_vector: false,
        })

        if (!points?.length) {
          return null
        }

        const point = points[0] as QdrantSearchResponse
        const { metaDescription, pageTitle, hostName } =
          point?.payload?.metadata

        // @ts-ignore
        result[dataSrcId] = {
          hostName,
          metaDescription,
          pageTitle,
        }
        return null
      }),
    )
    console.timeEnd('getVectorItemsByDataSrcId')

    // @ts-ignore
    return result
  } catch (err) {}
}
