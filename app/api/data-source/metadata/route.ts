import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceType } from '@prisma/client'

import { authOptions } from '@/lib/authOptions'

import { getChunksFromDoc } from '@/lib/loaders/genericDocLoader'
import { readFormData } from '@/lib/utils'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  if (!req || !req.headers.get('content-type')?.startsWith('multipart/form-data')) {
    return new NextResponse('Missing form-data', {
      status: 400,
    })
  }

  const { file } = await readFormData(req)

  if (!file) {
    return new NextResponse(`Missing file.`, {
      status: 400,
    })
  }

  try {
    const chunks = await getChunksFromDoc({ file, DSType: DataSourceType.file })

    const textSize = chunks?.reduce((acc, doc) => acc + doc?.pageContent?.length, 0)

    if (!chunks?.length || !textSize) {
      return NextResponse.json('File is empty', {
        status: 400,
      })
    }

    const { name, type } = file

    return NextResponse.json({ textSize, name, type })
  } catch (err) {
    // Handle the error case
    console.error('Metadata Error:: ', err)
    return new NextResponse('Unsupported file type', {
      status: 403,
    })
  }
}
