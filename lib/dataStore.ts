import { DataStoreType } from '@prisma/client'
import prisma from '@/lib/dbConnection'

export { searchSimilarText } from '@/lib/qdrant'

export const getDataStoreList = async (userId: string) => {
  // Fetch data using Prisma based on the user
  const dataStoreList = await prisma.dataStore.findMany({
    where: { ownerId: userId },
  })

  return dataStoreList
}

export const createDataStore = async (userId: string, name: string) => {
  const type = DataStoreType.qdrant

  // Check if a datastore with the specified name already exists for the user
  const dataStoreNameExists = await prisma.dataStore.findFirst({
    where: {
      name,
      ownerId: userId,
    },
  })

  if (dataStoreNameExists) {
    // If it exists, append a random string or an index to make it unique
    name = `${name}-${Math.random().toString(36).substring(2, 5)}` // appending a random 3-character string
  }

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

export const deleteDataStore = async (userId: string, dataStoreId: string) => {
  const dataStore = await prisma.dataStore.delete({
    where: {
      id: dataStoreId,
      ownerId: userId,
    },
  })
  console.log('Deleted DS', dataStore)

  return dataStore
}
