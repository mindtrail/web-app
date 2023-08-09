import { getDocumentChunks } from '@/lib/datastore/fileLoader'
import { createAndStoreVectors } from '@/lib/datastore/qdrant'
import { uploadToS3 } from '@/lib/datastore/s3'
import prisma from '@/lib/dbConnection'
import { DatastoreType } from '@prisma/client'

export { searchSimilarText } from '@/lib/datastore/qdrant'

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

export const getDatastoreList = async (userId: string) => {
  // Fetch data using Prisma based on the user
  const datastoreList = await prisma.datastore.findMany({
    where: { ownerId: userId },
  })

  return datastoreList
}

export const createDataStore = async (userId: string, name: string) => {
  const type = DatastoreType.qdrant

  const datastore = await prisma.datastore.create({
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
  const datastore = await prisma.datastore.deleteMany({
    where: {
      ownerId: userId,
    },
  })
  console.log('datastore', datastore)
  return datastore
}
