import { DataSource, DataSourceType } from '@prisma/client'
import prisma from '@/lib/db/connection'

import { getURLDisplayName } from '@/lib/utils'

export const getDataSourceListForUser = async (
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
    include: {
      dataSourceTags: {
        include: {
          tag: true,
        },
      },
    },
  })

  return dataSourceList
}

export const getDataSourceListByIds = async (
  dataSourceList: string[],
  userId?: string,
) => {
  const result = await prisma.dataSource.findMany({
    where: {
      id: {
        in: dataSourceList,
      },
      dataSourceUsers: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      dataSourceTags: {
        include: {
          tag: true,
        },
      },
    },
  })

  // Sort the result based on the order in dataSourceList
  const sortedResult = dataSourceList
    .map((id) => result.find((dataSource) => dataSource.id === id))
    .filter(Boolean)

  return sortedResult
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
  'type' | 'name' | 'nbChunks' | 'textSize'
> &
  Partial<Pick<DataSource, 'summary' | 'displayName' | 'status'>> & {
    userId: string
  }

export const dataSourceExists = async (name: string, userId: string) => {
  // check if datasource exists for the logged in user
  const dataSource = await prisma.dataSource.findFirst({
    where: {
      name,
      dataSourceUsers: {
        some: {
          userId,
        },
      },
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
        create: {
          user: {
            connect: { id: userId },
          },
        },
      },
    },
  })

  return dataSource
}

type UpdateDataSourcePayload = {
  id: string
} & Partial<CreateDataSourcePayload>

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
  dataSourceIdList: string[],
  userId: string,
) => {
  // Step 1: Delete the m2m relationship between the user and the dataSource
  await prisma.dataSourceUser.deleteMany({
    where: {
      dataSourceId: {
        in: dataSourceIdList,
      },
      userId,
    },
  })

  const dataSourcesToDeleteFromDB = await prisma.dataSource.findMany({
    where: {
      id: {
        in: dataSourceIdList,
      },
      dataSourceUsers: {
        none: {},
      },
    },
  })

  // Step 2: Delete the dataSource if there are no more users associated with it

  await prisma.dataSource.deleteMany({
    where: {
      id: {
        in: dataSourcesToDeleteFromDB.map((dataSource) => dataSource.id),
      },
    },
  })

  console.log(
    'dataSourceDeleted:::',
    dataSourcesToDeleteFromDB.map((dataSource) => dataSource.id),
  )
  return dataSourcesToDeleteFromDB
}
