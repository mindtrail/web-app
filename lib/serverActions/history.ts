'use server'

import { getServerSession } from 'next-auth/next'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/authOptions'

import { deleteDataSourceDbOp } from '@/lib/db/dataSource'
import { deleteFileFromGCS } from '@/lib/cloudStorage'

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
    const dataSource = await deleteDataSourceDbOp(dataSourceIdList, userId)

    // Delete dataSource from Qdrant and GCS
    // deleteFileFromGCS(dataSource)
    // @TODO delete points from Qdrant -> Dimitri

    revalidatePath('/history')
    return { dataSource }
  } catch (error) {
    return { status: 404 }
  }
}
