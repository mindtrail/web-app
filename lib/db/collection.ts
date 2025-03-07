import prisma from '@/lib/db/connection'
import { CollectionDataSource, Collection, DataSource } from '@prisma/client'

type CollectionListProps = {
  userId: string
  includeDataSource?: boolean
}

export const getCollectionListDbOp = async ({
  userId,
  includeDataSource = false,
}: CollectionListProps) => {
  // Fetch data using Prisma based on the user
  const collectionList = await prisma.collection.findMany({
    where: { ownerId: userId },
    include: {
      // @TODO: retrieve dataSources from the DB
      collectionDataSource: includeDataSource,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return collectionList
}

type GetCollectionProps = {
  userId: string
  collectionId: string
  includeDataSource?: boolean
}

type CollectionWithDataSources = Collection & {
  collectionDataSource: (CollectionDataSource & {
    dataSource: DataSource
  })[]
}

// OBSOLETE -> instead of this I moved to get data from the DS, and do the join from that direction
export const getCollectionDbOp = async ({
  userId,
  collectionId,
  includeDataSource = false,
}: GetCollectionProps) => {
  // Fetch data using Prisma based on the user
  const collection = (await prisma.collection.findUnique({
    where: { ownerId: userId, id: collectionId },
    include: includeDataSource
      ? {
          collectionDataSource: {
            include: { dataSource: true },
            orderBy: { dataSource: { createdAt: 'desc' } },
          },
        }
      : {},
  })) as CollectionWithDataSources

  if (!collection) {
    return null
  }

  if (!includeDataSource) {
    return collection
  }

  const { collectionDataSource, ...rest } = collection
  const dataSources = collectionDataSource.map((item) => item?.dataSource)

  return {
    ...rest,
    dataSources,
  }
}

export const createCollectionDbOp = async ({
  userId,
  name,
  description,
}: CreateCollection) => {
  // Check if a collection with the specified name already exists for the user
  const nameExists = await prisma.collection.findFirst({
    where: {
      name,
      ownerId: userId,
    },
  })

  if (nameExists) {
    // If it exists, append a random string or an index to make it unique
    name = `${name}-${Math.floor(Math.random() * 90000 + 10000)}` // appending a random 5 char nr
  }

  const collection = await prisma.collection.create({
    // @ts-ignore - Prisma types are not recognizing the connect field
    data: {
      name,
      description,
      owner: {
        connect: {
          id: userId,
        },
      },
    },
  })

  return collection
}

export const updateCollectionDbOp = async ({
  collectionId,
  userId,
  ...rest
}: UpdateCollection) => {
  const collection = await prisma.collection.update({
    where: {
      id: collectionId,
      ownerId: userId,
    },
    data: {
      ...rest,
    },
  })

  console.log('UPDATE --- ', rest, collection)
  return collection
}

export const deleteAllCollectionsForUser = async (userId: string) => {
  const collection = await prisma.collection.deleteMany({
    where: {
      ownerId: userId,
    },
  })

  return collection
}

export const deleteCollectionDbOp = async (userId: string, collectionId: string) => {
  // Delete all data sources for the collection
  return await prisma.$transaction(async (prisma) => {
    await prisma.collectionDataSource.deleteMany({
      where: {
        collectionId: collectionId,
      },
    })

    return await prisma.collection.delete({
      where: {
        id: collectionId,
        ownerId: userId,
      },
    })
  })
}
