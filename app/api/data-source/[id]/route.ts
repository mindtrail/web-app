import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { deleteDataSourceDbOp } from '@/lib/db/dataSource'
import { deleteFileFromGCS } from '@/lib/cloudStorage'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  const dataSourceId = params.id

  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }
  try {
    const dataSource = await deleteDataSourceDbOp(userId, dataSourceId)
    // Delete dataSource from Qdrant and GCS
    const res = await deleteFileFromGCS(dataSource)

    return NextResponse.json({ dataSource })
  } catch (error) {
    return new NextResponse('Collection not found', { status: 404 })
  }
}
