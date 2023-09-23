import { DataStoreType } from '@prisma/client'
import prisma from '@/lib/db/connection'

export { searchSimilarText } from '@/lib/qdrant'

type DataStoreList = {
  userId: string
  includeDataSrc?: boolean
}

type DataStoreById = {
  userId: string
  dataStoreId: string
}

export const getDataStoreListDbOp = async ({
  userId,
  includeDataSrc = false,
}: DataStoreList) => {
  // Fetch data using Prisma based on the user
  const dataStoreList = await prisma.dataStore.findMany({
    where: { ownerId: userId },
    include: {
      dataSrcs: includeDataSrc,
    },
  })

  return dataStoreList
}

export const getDataStoreById = async ({
  userId,
  dataStoreId,
}: DataStoreById) => {
  // Fetch data using Prisma based on the user
  const dataStoreList = await prisma.dataStore.findUnique({
    where: { ownerId: userId, id: dataStoreId },
    include: {
      dataSrcs: true,
    },
  })

  return dataStoreList
}

export const createDataStoreDbOp = async ({
  userId,
  name,
  description,
}: CreateDataStore) => {
  const type = DataStoreType.qdrant

  // Check if a datastore with the specified name already exists for the user
  const nameExists = await prisma.dataStore.findFirst({
    where: {
      name,
      ownerId: userId,
    },
  })

  if (nameExists) {
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

export const updateDataStoreDbOp = async ({
  dataStoreId,
  userId,
  ...rest
}: UpdateDataStore) => {
  const dataStore = await prisma.dataStore.update({
    where: {
      id: dataStoreId,
      ownerId: userId,
    },
    data: {
      ...rest,
    },
  })

  console.log('UPDATE --- ', rest, dataStore)
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

export const deleteDataStoreDbOp = async (
  userId: string,
  dataStoreId: string,
) => {
  const dataStore = await prisma.dataStore.delete({
    where: {
      id: dataStoreId,
      ownerId: userId,
    },
  })

  return dataStore
}

export const deleteDataSrcDbOp = async (userId: string, dataSrcId: string) => {
  const dataSrc = await prisma.dataSrc.delete({
    where: {
      id: dataSrcId,
      ownerId: userId,
    },
  })

  return dataSrc
}
