import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { deleteClipping } from '@/lib/db/clipping'

type EditRouteParams = { params: { id: string } }

export async function DELETE(req: Request, { params }: EditRouteParams) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  const clippingId = params.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const deletedClipping = await deleteClipping(userId, clippingId)
    return NextResponse.json({ deletedClipping })
  } catch (error) {
    return new NextResponse('Collection not found', { status: 404 })
  }
}
