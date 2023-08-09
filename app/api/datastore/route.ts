import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/lib/types'

import { getDataStoreList } from '@/lib/dataStore'

export async function GET() {
  console.time('session')
  const session = (await getServerSession(authOptions)) as ExtendedSession
  console.timeEnd('session')

  if (!session?.user?.id) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const userId = session.user?.id
  const datastoreList = await getDataStoreList(userId)

  return NextResponse.json({ datastoreList })
}
