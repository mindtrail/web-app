import { DataSrcStatus, DataSrc } from '@prisma/client'
import prisma from '@/lib/db/connection'

export const getDataSrcList = async (userId: string, datastoreId: string) => {
  const dataSrcList = await prisma.dataSrc.findMany({
    where: {
      ownerId: userId,
      dataStoreId: datastoreId,
    },
  })

  return dataSrcList
}

type CreateDataSrcPayload = Pick<
  DataSrc,
  'name' | 'dataStoreId' | 'ownerId' | 'type' | 'nbChunks' | 'textSize'
>

export const createDataSrc = async (payload: CreateDataSrcPayload) => {
  const { name, dataStoreId, ownerId, type, nbChunks, textSize } = payload

  const dataSrc = await prisma.dataSrc.create({
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

  return dataSrc
}

type updateDataSrcPayload = Partial<CreateDataSrcPayload> & {
  id: string
  status?: DataSrcStatus
}

export const updateDataSrc = async (payload: updateDataSrcPayload) => {
  const { id, dataStoreId, ...rest } = payload

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
