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

  if (
    !req ||
    !req.headers.get('content-type')?.startsWith('multipart/form-data')
  ) {
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
    const chunks = await getChunksFromDoc({ file, type: DataSourceType.file })

    const textSize = chunks?.reduce(
      (acc, doc) => acc + doc?.pageContent?.length,
      0,
    )

    if (!chunks?.length || !textSize) {
      return NextResponse.json('File is empty', {
        status: 400,
      })
    }

    let fileMetadata = {}

    const { dataSourceId, ...metadata } = chunks[0]?.metadata
    const { name, type } = file

    if (type === 'application/pdf') {
      const { info } = metadata.pdf

      if (info) {
        const title = info?.Title
        const description = info?.Subject || info?.Description || info?.Author
        const tags = info?.Keywords?.split(',').map((tag: string) => tag.trim())

        // This way I only set the prop if there is a value
        fileMetadata = {
          ...(title ? { title } : {}),
          ...(description ? { description } : {}),
          ...(tags ? { tags: tags } : {}),
        }
      }
    }

    console.log('File Metadata -- --', fileMetadata)

    return NextResponse.json({ textSize, name, type })
  } catch (err) {
    // Handle the error case
    console.error('Metadata Error:: ', err)
    return new NextResponse('Unsupported file type', {
      status: 403,
    })
  }
}
