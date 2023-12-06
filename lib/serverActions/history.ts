'use server'

import { getServerSession } from 'next-auth/next'
import { revalidateTag } from 'next/cache'
import { authOptions } from '@/lib/authOptions'

import { deleteDataSrcDbOp } from '@/lib/db/dataSource'
import { deleteFileFromGCS } from '@/lib/cloudStorage'

type deletePayload = {
  dataSrcId: string
}
export async function deleteDataSrc(props: deletePayload) {
  const { dataSrcId } = props

  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return {
      status: 401,
    }
  }

  try {
    const dataSource = await deleteDataSrcDbOp(userId, dataSrcId)

    // Delete dataSource from Qdrant and GCS
    // deleteFileFromGCS(dataSource)

    // @TODO delete points from Qdrant -> Dimitri

    revalidateTag('history')
    return { dataSource }
  } catch (error) {
    return { status: 404 }
  }
}
