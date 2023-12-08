import { DataSourceStatus, DataSource } from '@prisma/client'
import prisma from '@/lib/db/connection'

export const getDataSourceList = async (
  userId: string,
  collectionId?: string,
) => {
  const dataSourceList = await prisma.dataSource.findMany({
    where: {
      // @TODO: this was a 1-m relationship, now it's a m-m relationship, update it
      // ownerId: userId,
      // collectionId: collectionId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return dataSourceList
}

export const getDataSourceById = async (dataSourceId: string) => {
  const dataSource = await prisma.dataSource.findUnique({
    where: {
      id: dataSourceId,
    },
  })

  return dataSource
}

type CreateDataSourcePayload = Pick<
  DataSource,
  'name' | 'type' | 'nbChunks' | 'textSize'
>

export const createDataSource = async (
  payload: CreateDataSourcePayload,
  uniqueName = false,
) => {
  const { name, ...rest } = payload

  if (uniqueName) {
    const existingDataSource = await prisma.dataSource.findFirst({
      where: { name },
    })
    if (existingDataSource) {
      const { id } = existingDataSource
      return updateDataSource({ id, ...payload })
    }
  }

  const dataSource = await prisma.dataSource.create({
    data: {
      ...rest,
      name,
      // owner: {
      //   connect: {
      //     // @ts-ignore - ownerId is already checked before calling this function
      //     id: ownerId,
      //   },
      // },
      collectionDataSource: {
        // connect: {
        // @ts-ignore - collectionId is already checked before calling this function
        // id: collectionId,
        // },
      },
    },
  })

  return dataSource
}

type UpdateDataSourcePayload = Partial<CreateDataSourcePayload> & {
  id: string
  status?: DataSourceStatus
}

export const updateDataSource = async (payload: UpdateDataSourcePayload) => {
  const { id, ...rest } = payload

  const dataSource = await prisma.dataSource.update({
    where: {
      id,
    },
    data: {
      ...rest,
    },
  })

  return dataSource
}

export const deleteDataSourceDbOp = async (
  userId: string,
  dataSourceId: string,
) => {
  const dataSource = await prisma.dataSource.delete({
    where: {
      id: dataSourceId,
      // @TODO ....
      // ownerId: userId,
    },
  })

  return dataSource
}
