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
