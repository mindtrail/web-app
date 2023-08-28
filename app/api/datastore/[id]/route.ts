import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { deleteDataStoreDbOp, updateDataStoreDbOp } from '@/lib/db/dataStore'

type EditRouteParams = { params: { id: string } }

export async function DELETE(req: Request, { params }: EditRouteParams) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  const dataStoreId = params.id

  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }
  try {
    const datastoreList = await deleteDataStoreDbOp(userId, dataStoreId)
    return NextResponse.json({ datastoreList })
  } catch (error) {
    return new NextResponse('DataStore not found', { status: 404 })
  }
}

export async function PATCH(req: Request, { params }: EditRouteParams) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  const dataStoreId = params.id

  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  const body = (await req.json()) as Partial<CreateDataStore>
  const { userId: clientUserId, ...rest } = body

  if (clientUserId !== userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  try {
    const dataStore = await updateDataStoreDbOp({
      dataStoreId,
      userId,
      ...rest,
    })

    return NextResponse.json(dataStore)
  } catch (error) {
    console.error(error)
    return new Response('Error creating datastore', {
      status: 500,
    })
  }
}
