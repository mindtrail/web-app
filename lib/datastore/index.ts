import { getDocumentChunks } from '@/lib/datastore/fileLoader'
import { createAndStoreVectors } from '@/lib/datastore/qdrant'
import { uploadToS3 } from '@/lib/datastore/s3'

export { searchSimilarText } from '@/lib/datastore/qdrant'

export const uploadFile = async (fileBlob: Blob, userId: string) => {
  uploadToS3(fileBlob, userId)
  // @TODO: return file upload success, and run the rest of the process in the background

  const docs = await getDocumentChunks(fileBlob)

  if (!docs.length) {
    console.log('No docs')
    return
  }

  await createAndStoreVectors(docs, userId)

  return docs
}
