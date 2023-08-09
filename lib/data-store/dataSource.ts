import prisma from '@/lib/dbConnection'

export const getDataSourceList = async (userId: string, datastoreId: string) => {
  const dataSourceList = await prisma.appDataSource.findMany({
    where: {
      ownerId: userId,
      dataStoreId: datastoreId,
     },
  })

  return dataSourceList
}