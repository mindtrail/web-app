import { Document } from 'langchain/document'
import { QdrantVectorStore } from 'langchain/vectorstores/qdrant'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'

import { getDocumentChunks } from '@/lib/fileLoader'
import { createAndStoreVectors } from '@/lib/qdrant'

dotenv.config()

const TEST_COLLECTION = 'test-collection'

const s3Client = new S3Client({
  region: 'eu-central-1',
  endpoint: 'https://s3.eu-central-1.amazonaws.com',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export const uploadFile = async (file) => {
  console.log(process.env.AWS_ACCESS_KEY_ID)

  const docs = await getDocumentChunks(file)

  if (!docs.length) {
    console.log('No docs')
    return
  }
  console.log('DOCS', docs)
  return docs

  uploadToS3(file)

  console.log('vectors')
  // console.log('DOCS', docs)
  const result = await createAndStoreVectors(docs)

  console.log(result)
  return result
}

// @TODO: make this dynamic
const USER_NAME = 'test-user'

async function uploadToS3(file: MULTER_FILE) {
  const { originalname, buffer } = file
  const key = `dataset1/${USER_NAME}-${originalname}-${Date.now().toString()}`

  console.log(buffer)
  const command = new PutObjectCommand({
    Bucket: 'indie-chat',
    Key: key,
    Body: buffer,
  })

  try {
    const response = await s3Client.send(command)
    console.log('s3', response)
    return response
  } catch (error) {
    console.error('Error uploading to S3', error)
  }
}

export const searchSimilarText = async (message: string, collection: string = TEST_COLLECTION) => {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(new OpenAIEmbeddings(), {
    collectionName: collection,
  })

  const response = await vectorStore.similaritySearch(message, 5)
  console.log(response)

  return response
}
