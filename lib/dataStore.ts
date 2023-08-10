import { uploadToS3 } from '@/lib/s3'
import { createDataSource } from '@/lib/dataSource'
import { getDocumentChunks } from '@/lib/fileLoader'

import prisma from '@/lib/dbConnection'
import { DataStoreType, DataSourceType } from '@prisma/client'

export { searchSimilarText } from '@/lib/qdrant'

export const uploadFile = async (formData: FormData, userId: string) => {
  let dataStoreId = ''
  let fileBlob: Blob | null = null

  for (const value of Array.from(formData.values())) {
    // FormDataEntryValue can either be type `Blob` or `string`.
    // If its type is object then it's a Blob
    if (typeof value == 'object') {
      fileBlob = value
    }
    // If its type is string then it's the dataStoreId
    if (typeof value == 'string') {
      dataStoreId = JSON.parse(value)?.dataStoreId
    }
  }

  if (!dataStoreId || !fileBlob) {
    console.log('No dataStoreId')
    return null
  }

  const { name: fileName = '' } = fileBlob

  // Return nr of chunks & character count
  const docs = await getDocumentChunks(fileBlob)

  const dataSourcePayload = {
    name: fileName,
    dataStoreId,
    ownerId: userId,
    type: DataSourceType.file,
    nbChunks: docs.length,
    textSize: docs.reduce((acc, doc) => acc + doc?.pageContent?.length, 0),
  }

  const dataSource = await createDataSource(dataSourcePayload)

  console.log(dataSource)
  
  // Upload file to S3
  const s3Upload = uploadToS3({ fileBlob, userId, dataStoreId, dataSourceId: dataSource.id })
  // @TODO: return file upload success, and run the rest of the process in the background
  s3Upload.then((res) => {
    console.log('res', res)
  })

  if (!docs.length) {
    console.log('No docs')
    return null
  }

  return docs
}

export const getDataStoreList = async (userId: string) => {
  // Fetch data using Prisma based on the user
  const dataStoreList = await prisma.dataStore.findMany({
    where: { ownerId: userId },
  })

  return dataStoreList
}

export const createDataStore = async (userId: string, name: string) => {
  const type = DataStoreType.qdrant

  const dataStore = await prisma.dataStore.create({
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

  return dataStore
}

export const deleteAllDataStoresForUser = async (userId: string) => {
  const dataStore = await prisma.dataStore.deleteMany({
    where: {
      ownerId: userId,
    },
  })
  console.log('dataStore', dataStore)
  return dataStore
}
