import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { deleteCollectionDbOp, updateCollectionDbOp } from '@/lib/db/collection'

type EditRouteParams = { params: { id: string } }

export async function DELETE(req: Request, { params }: EditRouteParams) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  const collectionId = params.id

  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }
  try {
    const collectionList = await deleteCollectionDbOp(userId, collectionId)
    return NextResponse.json({ collectionList })
  } catch (error) {
    return new NextResponse('Collection not found', { status: 404 })
  }
}

export async function PATCH(req: Request, { params }: EditRouteParams) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  const collectionId = params.id

  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  const body = (await req.json()) as Partial<CreateCollection>
  const { userId: clientUserId, ...rest } = body

  if (clientUserId !== userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  try {
    const collection = await updateCollectionDbOp({
      collectionId,
      userId,
      ...rest,
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error(error)
    return new Response('Error creating collection', {
      status: 500,
    })
  }
}
