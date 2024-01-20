import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import { createClipping, getAllClippings } from '@/lib/db/clipping'

export async function GET() {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const collectionList = await getAllClippings(userId)

  return NextResponse.json(collectionList)
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id

  console.log('userId', userId)
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const body = (await req.json()) as CreateCollection
  const { name, description, userId: clientUserId } = body

  // @TODO: add auth
  // if (clientUserId !== userId) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //   })
  // }

  try {
    const collection = await createClipping({
      userId,
      payload,
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error(error)
    return new Response('Error creating collection', {
      status: 500,
    })
  }
}
