import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { createClipping, getClippingList } from '@/lib/db/clipping'

export async function GET() {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const clippingList = await getClippingList(userId)

  return NextResponse.json(clippingList)
}

// TODO: Add authentication
export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id

  console.log('userId', userId)
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const payload = (await req.json()) as SaveClipping

  console.log('body', payload.selector)

  // @TODO: add auth
  // if (clientUserId !== userId) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //   })
  // }

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
