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

type DataStore = {
  userId: string
  name: string
  description: string
}

export const createDataStore = async ({ userId, name, description }: DataStore) => {
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
    name = `${name}-${Math.floor(Math.random() * 90000 + 10000)}` // appending a random 5 char nr
  }

  const dataStore = await prisma.dataStore.create({
    // @ts-ignore - Prisma types are not recognizing the connect field
    data: {
      name,
      description,
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

  return dataStore
}

export const deleteDataStore = async (userId: string, dataStoreId: string) => {
  const dataStore = await prisma.dataStore.delete({
    where: {
      id: dataStoreId,
      ownerId: userId,
    },
  })

  return dataStore
}
