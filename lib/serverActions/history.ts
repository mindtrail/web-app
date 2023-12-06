'use server'

import { getServerSession } from 'next-auth/next'
import { revalidateTag } from 'next/cache'
import { authOptions } from '@/lib/authOptions'

import { deleteDataSourceDbOp } from '@/lib/db/dataSource'
import { deleteFileFromGCS } from '@/lib/cloudStorage'

type deletePayload = {
  dataSourceId: string
}
export async function deleteDataSource(props: deletePayload) {
  const { dataSourceId } = props

  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return {
      status: 401,
    }
  }

  try {
    const dataSource = await deleteDataSourceDbOp(userId, dataSourceId)

    // Delete dataSource from Qdrant and GCS
    // deleteFileFromGCS(dataSource)

    // @TODO delete points from Qdrant -> Dimitri

    revalidateTag('history')
    return { dataSource }
  } catch (error) {
    return { status: 404 }
  }
}
