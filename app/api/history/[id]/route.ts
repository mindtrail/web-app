import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { deleteDataSrcDbOp } from '@/lib/db/dataSrc'
import { deleteFileFromGCS } from '@/lib/cloudStorage'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  const dataSrcId = params.id

  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }
  try {
    const dataSrc = await deleteDataSrcDbOp(userId, dataSrcId)

    // Delete dataSrc from Qdrant and GCS
    deleteFileFromGCS(dataSrc)

    // @TODO delete points from Qdrant -> Dimitri

    return NextResponse.json({ dataSrc })
  } catch (error) {
    return new NextResponse('DataStore not found', { status: 404 })
  }
}
