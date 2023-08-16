import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/lib/types'

import { deleteDataStore } from '@/lib/db/dataStore'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  console.time('session')
  const session = (await getServerSession(authOptions)) as ExtendedSession
  console.timeEnd('session')

  const userId = session?.user?.id
  const dataStoreId = params.id

  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }
  try {
    const datastoreList = await deleteDataStore(userId, dataStoreId)
    return NextResponse.json({ datastoreList })
  } catch (error) {
    return new NextResponse('DataStore not found', { status: 404 })
  }
}

export async function PUT(req: Request) {
  console.time('session')
  const session = (await getServerSession(authOptions)) as ExtendedSession
  console.timeEnd('session')

  const userId = session?.user?.id

  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  const body = await req.json()

  return NextResponse.json({})
}
