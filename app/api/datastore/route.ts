import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/lib/types'

import { getDataStoreList, createDataStore } from '@/lib/dataStore'

export async function GET() {
  console.time('session')
  const session = (await getServerSession(authOptions)) as ExtendedSession
  console.timeEnd('session')

  const userId = session?.user?.id

  if (!userId) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const datastoreList = await getDataStoreList(userId)

  return NextResponse.json({ datastoreList })
}

export async function POST(req: Request) {
  console.time('session')
  const session = (await getServerSession(authOptions)) as ExtendedSession
  console.timeEnd('session')

  const userId = session?.user?.id

  if (!userId) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const body = await req.json()
  const { dataStoreName, userId: clientUserId } = body

  if (clientUserId !== userId) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  // Will send the

  try {
    const newDS = createDataStore(userId, dataStoreName)
    console.log('newDS', newDS)
  } catch (error) {
    console.error(error)
    return new Response('Error creating datastore', {
      status: 500,
    })
  }

  return NextResponse.json({})
}
