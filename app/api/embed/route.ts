import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''

interface EmbeddingPayload {
  userId: string
  dataStoreId: string
  urls: string[]
}

export async function POST(req: Request) {
  // This will be a call from a Cloud Run service, from the same project & VPC
  // I want to make this call accessible only from the Cloud Run service

  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  const secret = req.headers.get('X-Custom-Secret')
  if (secret !== EMBEDDING_SECRET) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  let body

  try {
    body = (await req.json()) as EmbeddingPayload
  } catch (err) {
    console.error(err)
    return new Response('Bad Request', {
      status: 400,
    })
  }

  // Return nr of chunks & character count
  const docs = {} // await getChunksFromFile(fileBlob)

  if (docs instanceof Error) {
    // Handle the error case
    console.error(docs.message)
    return new NextResponse('Unsupported file type', {
      status: 400,
    })
  }

  return NextResponse.json({ 1234: '1234' })
}
