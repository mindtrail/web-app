import prisma from '@/lib/dbConnection'
import { DataStoreType } from '@prisma/client'

export const getDataSourceList = async (userId: string, datastoreId: string) => {
  const datasourceList = await prisma.appDataSource.findMany({
    where: {
      ownerId: userId,
      dataStoreId: datastoreId,
     },
  })
}