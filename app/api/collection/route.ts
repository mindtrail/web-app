import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

import {
  getCollectionListDbOp,
  createCollectionDbOp,
} from '@/lib/db/collection'

export async function GET() {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const datastoreList = await getCollectionListDbOp({ userId })

  return NextResponse.json(datastoreList)
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const body = (await req.json()) as CreateCollection
  const { name, description, userId: clientUserId } = body

  if (clientUserId !== userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  try {
    const collection = await createCollectionDbOp({
      userId,
      name,
      description,
    })

    return NextResponse.json(collection)
  } catch (error) {
    console.error(error)
    return new Response('Error creating collection', {
      status: 500,
    })
  }
}
