'use server'

import { getServerSession } from 'next-auth/next'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/authOptions'

import { deleteDataSourceDbOp } from '@/lib/db/dataSource'
import { deleteFileFromGCS } from '@/lib/cloudStorage'
import { deleteVectorsForDataSource } from '@/lib/qdrant-langchain'

type deletePayload = {
  dataSourceIdList: string[]
}

export async function deleteDataSource({ dataSourceIdList }: deletePayload) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return {
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    }
  }

  try {
    const deletedDataSources = await deleteDataSourceDbOp(dataSourceIdList, userId)

    deleteFileFromGCS(deletedDataSources, userId)
    deleteVectorsForDataSource(dataSourceIdList)

    revalidatePath('/history')
    return { deletedDataSources }
  } catch (error) {
    return { status: 404 }
  }
}
