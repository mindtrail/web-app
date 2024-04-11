import { QdrantClient, Schemas } from '@qdrant/js-client-rest'
import { Document } from 'langchain/document'
import { QdrantVectorStore, QdrantLibArgs } from 'langchain/vectorstores/qdrant'

import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || ''
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
  metadata?: any
}

type QdrantSearchResponse = Schemas['ScoredPoint'] & {
  payload: {
    metadata: {
      description: string
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
  const { docs, metadata: vectorMetadata } = props

  const payload = docs.map((doc) => {
    const { pageContent, metadata } = doc
    return {
      pageContent,
      metadata: {
        ...metadata,
        ...vectorMetadata,
      },
    }
  })

  const vectorStore = new QdrantVectorStore(new OpenAIEmbeddings(), {
    ...QDRANT_ARGS,
    collectionName: QDRANT_COLLECTION,
  })

  const result = await vectorStore.addDocuments(payload)
  return result
}

export const searchSimilarTextPlain = async (message: string) => {
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  })

  console.time('embed')
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: message,
    }),
  })

  console.timeEnd('embed')

  const json = await res.json()
  const embedding = json?.data[0]?.embedding

  console.time('Qdrant Client ---- :::')
  const collection = await client.search(QDRANT_COLLECTION, {
    vector: embedding,
    limit: 10,
  })
  console.timeEnd('Qdrant Client ---- :::')

  // console.log(collection)

  // return result
  // .filter(([_doc, score], index) => {
  // return score > SIMILARITY_THRESHOLD
  // })
  // .sort(([_docA, scoreA], [_docB, scoreB]) => scoreB - scoreA)
  // .splice(0, NR_OF_SOURCES)
  // .map(([doc]) => doc)
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

export const getVectorItemsByDataSourceId = async (
  dataSourceIdList: string[],
  collectionName?: string,
): Promise<[] | undefined> => {
  const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  })

  if (!dataSourceIdList?.length) {
    return
  }

  try {
    console.time('getVectorItemsByDataSourceId')
    const result = {}

    await Promise.all(
      dataSourceIdList.map(async (dataSourceId) => {
        const { points } = await client.scroll(QDRANT_COLLECTION, {
          filter: {
            must: [
              {
                key: 'metadata.dataSourceId',
                match: {
                  value: dataSourceId,
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
        const { description, pageTitle, hostName } = point?.payload?.metadata

        // @ts-ignore
        result[dataSourceId] = {
          hostName,
          description,
          pageTitle,
        }
        return null
      }),
    )
    console.timeEnd('getVectorItemsByDataSourceId')

    // @ts-ignore
    return result
  } catch (err) {}
}
