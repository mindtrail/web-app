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

type DataSourcePayload = Pick<
  AppDataSource,
  'name' | 'dataStoreId' | 'ownerId' | 'type' | 'nbChunks' | 'textSize'
>

export const createDataSource = async (props: DataSourcePayload) => {
  const { name, dataStoreId, ownerId, type, nbChunks, textSize } = props
  // const dataSource = await prisma.appDataSource.create({
  //   data: {
  //     name,
  //     dataStoreId: dataStoreId,
  //     ownerId: ownerId,
  //   },
  // })
  // return dataSource
}
