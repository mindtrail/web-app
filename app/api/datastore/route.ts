import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { getDataStoreListDbOp, createDataStoreDbOp } from '@/lib/db/dataStore'

export async function GET() {
  console.time('session')
  const session = (await getServerSession(authOptions)) as ExtendedSession
  console.timeEnd('session')

  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const datastoreList = await getDataStoreListDbOp({ userId })

  return NextResponse.json(datastoreList)
}

export async function POST(req: Request) {
  console.time('session')
  const session = (await getServerSession(authOptions)) as ExtendedSession
  console.timeEnd('session')

  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const body = (await req.json()) as CreateDataStore
  const { name, description, userId: clientUserId } = body

  if (clientUserId !== userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  try {
    const dataStore = await createDataStoreDbOp({
      userId,
      name,
      description,
    })

    return NextResponse.json(dataStore)
  } catch (error) {
    console.error(error)
    return new Response('Error creating datastore', {
      status: 500,
    })
  }
}
