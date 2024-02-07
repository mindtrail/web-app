import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { createClipping, getClippingList } from '@/lib/db/clipping'

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = new URL(req.url)
  const groupByDataSource = !!url.searchParams.get('groupByDataSource')

  const clippingList = await getClippingList(userId, groupByDataSource)
  return NextResponse.json(clippingList)
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload = (await req.json()) as SavedClipping

  try {
    const newClipping = await createClipping({
      ...payload,
      userId,
    })

    return NextResponse.json(newClipping)
  } catch (error) {
    console.error(error)
    return new Response('Error creating collection', {
      status: 500,
    })
  }
}
