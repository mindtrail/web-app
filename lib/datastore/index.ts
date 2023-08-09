import { getDocumentChunks } from '@/lib/dataStore/fileLoader'
import { createAndStoreVectors } from '@/lib/dataStore/qdrant'
import { uploadToS3 } from '@/lib/dataStore/s3'
import prisma from '@/lib/dbConnection'
import { DataStoreType } from '@prisma/client'

export { searchSimilarText } from '@/lib/dataStore/qdrant'

export const uploadFile = async (fileBlob: Blob, userId: string) => {
  uploadToS3(fileBlob, userId)
  // @TODO: return file upload success, and run the rest of the process in the background

  const docs = await getDocumentChunks(fileBlob)

  if (!docs.length) {
    console.log('No docs')
    return
  }

  return docs
}

export const getDataStoreList = async (userId: string) => {
  // Fetch data using Prisma based on the user
  const datastoreList = await prisma.dataStore.findMany({
    where: { ownerId: userId },
  })

  return datastoreList
}

export const createDataStore = async (userId: string, name: string) => {
  const type = DataStoreType.qdrant

  const datastore = await prisma.dataStore.create({
    // @ts-ignore - Prisma types are not recognizing the connect field
    data: {
      name,
      type,
      owner: {
        connect: {
          id: userId,
        },
      },
    },
  })

  return datastore
}

export const deleteAllDataStoresForUser = async (userId: string) => {
  const datastore = await prisma.dataStore.deleteMany({
    where: {
      ownerId: userId,
    },
  })
  console.log('datastore', datastore)
  return datastore
}
