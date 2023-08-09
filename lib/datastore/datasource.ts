import prisma from '@/lib/dbConnection'
import { DatastoreType } from '@prisma/client'

export const getDatasourceList = async (userId: string, datastoreId: string) => {
  const datasourceList = await prisma.appDatasource.findMany({
    where: {
      ownerId: userId,
      datastoreId: datastoreId,
     },
  })
}