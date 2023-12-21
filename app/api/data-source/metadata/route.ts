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
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  if (
    !req ||
    !req.headers.get('content-type')?.startsWith('multipart/form-data')
  ) {
    return new Response('Missing form-data', {
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
      status: 403,
    })
  }

  const { chunks } = response

  const textSize = chunks.reduce(
    (acc, doc) => acc + doc?.pageContent?.length,
    0,
  )

  if (!chunks?.length || !textSize) {
    return NextResponse.json('File is empty', {
      status: 400,
    })
  }

  const { name, type } = file

  const { dataSourceId, ...metadata } = chunks[0]?.metadata
  console.log('Metadata for ---', metadata, file)

  let fileMetadata = {}
  if (file.type === 'application/pdf') {
    const { info } = metadata.pdf

    if (info) {
      const description = info?.Subject || info?.Description
      const author = info?.Author
      const tags = info?.Keywords?.split(',').map((tag: string) => tag.trim())

      // This way I only set the prop if there is a value
      fileMetadata = {
        ...(info?.Title ? { title: info?.Title } : {}),
        ...(description || author ? { description: description + author } : {}),
        ...(tags ? { tags: tags } : {}),
      }
    }
  }

  console.log('File Metadata', fileMetadata)

  return NextResponse.json({ textSize, name, type })
}
