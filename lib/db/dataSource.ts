import { DataSourceStatus, DataSource, DataSourceType } from '@prisma/client'
import prisma from '@/lib/db/connection'

import { getURLDisplayName } from '@/lib/utils'

export const getDataSourceList = async (
  userId: string,
  collectionId?: string,
) => {
  const dataSourceList = await prisma.dataSource.findMany({
    where: {
      dataSourceUsers: {
        some: {
          userId: userId,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  console.log(dataSourceList.length)

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

type CreateDataSourcePayload = Partial<DataSource> & {
  userId: string
  name: string
}

export const dataSourceExists = async (name: string) => {
  const dataSource = await prisma.dataSource.findFirst({
    where: {
      name,
    },
  })

  return dataSource
}

export const createDataSource = async (
  payload: CreateDataSourcePayload,
  uniqueName = false,
) => {
  const { name, userId, ...rest } = payload

  const displayName =
    payload.type === DataSourceType.web_page ? getURLDisplayName(name) : name

  if (uniqueName) {
    const existingDataSource = await prisma.dataSource.findFirst({
      where: { name },
    })
    if (existingDataSource) {
      const { id } = existingDataSource
      return updateDataSource({ id, ...payload, displayName })
    }
  }

  const dataSource = await prisma.dataSource.create({
    data: {
      ...rest,
      displayName,
      name,
      dataSourceUsers: {
        create: [
          {
            user: {
              connect: { id: userId },
            },
          },
        ],
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
