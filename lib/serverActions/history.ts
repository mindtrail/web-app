'use server'

import { getServerSession } from 'next-auth/next'
import { revalidateTag } from 'next/cache'
import { authOptions } from '@/lib/authOptions'

import { deleteDataSrcDbOp } from '@/lib/db/dataSrc'
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
    const dataSrc = await deleteDataSrcDbOp(userId, dataSrcId)

    // Delete dataSrc from Qdrant and GCS
    deleteFileFromGCS(dataSrc)

    // @TODO delete points from Qdrant -> Dimitri

    revalidateTag('history')
    return { dataSrc }
  } catch (error) {
    return { status: 404 }
  }
}
