import { DataSrcStatus, DataSrc } from '@prisma/client'
import prisma from '@/lib/db/connection'

export const getDataSrcList = async (userId: string, datastoreId?: string) => {
  const dataSrcList = await prisma.dataSrc.findMany({
    where: {
      ownerId: userId,
      dataStoreId: datastoreId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return dataSrcList
}

type CreateDataSrcPayload = Pick<
  DataSrc,
  'name' | 'dataStoreId' | 'ownerId' | 'type' | 'nbChunks' | 'textSize'
>

export const getDataSrcById = async (dataSrcId: string) => {
  const dataSrc = await prisma.dataSrc.findUnique({
    where: {
      id: dataSrcId,
    },
  })

  return dataSrc
}

export const createDataSrc = async (
  payload: CreateDataSrcPayload,
  uniqueName = false,
) => {
  const { name, dataStoreId, ownerId, ...rest } = payload

  if (uniqueName) {
    const existingDataSrc = await prisma.dataSrc.findFirst({
      where: { name },
    })
    if (existingDataSrc) {
      const { id } = existingDataSrc
      return updateDataSrc({ id, ...payload })
    }
  }

  const dataSrc = await prisma.dataSrc.create({
    data: {
      ...rest,
      name,
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

  return dataSrc
}

type updateDataSrcPayload = Partial<CreateDataSrcPayload> & {
  id: string
  status?: DataSrcStatus
}

export const updateDataSrc = async (payload: updateDataSrcPayload) => {
  const { id, ...rest } = payload

  const dataSrc = await prisma.dataSrc.update({
    where: {
      id,
    },
    data: {
      ...rest,
    },
  })

  return dataSrc
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
