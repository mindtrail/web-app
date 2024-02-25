import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { deleteClippingDbOp } from '@/lib/db/clipping'

type EditRouteParams = { params: { id: string } }

export async function DELETE(req: Request, { params }: EditRouteParams) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  const clippingIdList = [params.id]

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const deletedClipping = await deleteClippingDbOp({ userId, clippingIdList })
    return NextResponse.json({ deletedClipping })
  } catch (error) {
    return new NextResponse('Collection not found', { status: 404 })
  }
}
