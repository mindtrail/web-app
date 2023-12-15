import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceType } from '@prisma/client'
import { Document } from 'langchain/document'

import { authOptions } from '@/lib/authOptions'

import { getChunksFromDoc } from '@/lib/loaders/genericDocLoader'
import { readFormData } from '@/lib/utils'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  if (
    !req ||
    !req.headers.get('content-type')?.startsWith('multipart/form-data')
  ) {
    return new Response('Bad Request', {
      status: 400,
    })
  }

  const { file } = await readFormData(req)

  if (!file) {
    return new Response(`Missing file.`, {
      status: 400,
    })
  }

  // Return nr of chunks & character count
  const response = await getChunksFromDoc({
    file,
    type: DataSourceType.file,
  })

  if (response instanceof Error) {
    // Handle the error case
    console.error(response.message)
    return new NextResponse('Unsupported file type', {
      status: 400,
    })
  }

  const { chunks } = response
  const charCount = chunks.reduce(
    (acc, doc) => acc + doc?.pageContent?.length,
    0,
  )

  const { name, type } = file
  return NextResponse.json({ charCount, name, type })
}
