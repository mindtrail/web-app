import { Document } from 'langchain/document'
import { QdrantVectorStore } from 'langchain/vectorstores/qdrant'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

import { getDocumentChunks } from '@/lib/datastore/fileLoader'
import { createAndStoreVectors } from '@/lib/datastore/qdrant'
import { uploadToS3 } from '@/lib/datastore/s3'

const TEST_COLLECTION = 'test-collection'

export const uploadFile = async (fileBlob: Blob) => {
  // uploadToS3(fileBlob)

  // @TODO: return file upload success, and run the rest of the process in the background

  const docs = await getDocumentChunks(fileBlob)

  return docs
  if (!docs.length) {
    console.log('No docs')
    return
  }
  console.log('DOCS', docs)

  console.log('vectors')
  // console.log('DOCS', docs)
  // TODO: return the
  const result = await createAndStoreVectors(docs)

  console.log(result)
  return result
}

export const searchSimilarText = async (message: string, collection: string = TEST_COLLECTION) => {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(new OpenAIEmbeddings(), {
    collectionName: collection,
  })

  const response = await vectorStore.similaritySearch(message, 5)
  console.log(response)

  return response
}
