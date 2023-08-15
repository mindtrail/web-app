import prisma from '@/lib/dbConnection'
import { DataSourceType, AppDataSource } from '@prisma/client'

export const getDataSourceList = async (userId: string, datastoreId: string) => {
  const dataSourceList = await prisma.appDataSource.findMany({
    where: {
      ownerId: userId,
      dataStoreId: datastoreId,
    },
  })

  return dataSourceList
}

type DataSrcPayload = Pick<
  AppDataSource,
  'name' | 'dataStoreId' | 'ownerId' | 'type' | 'nbChunks' | 'textSize'
>

export const createDataSrc = async (props: DataSrcPayload) => {
  const { name, dataStoreId, ownerId, type, nbChunks, textSize } = props

  const dataSource = await prisma.appDataSource.create({
    data: {
      name,
      type,
      nbChunks,
      textSize,
      owner: {
        connect: {
          // @ts-ignore - ownerId is already checked before calling this function
          id: ownerId,
        },
      },
      dataStore: {
        connect: {
          // @ts-ignore - dataStoreId is already checked before calling this function
          id: dataStoreId,
        },
      },
    },
  })

  return dataSource
}
