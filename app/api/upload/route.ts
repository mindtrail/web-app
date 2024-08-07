import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceType } from '@prisma/client'
import { Document } from 'langchain/document'

import { authOptions } from '@/lib/authOptions'
import { uploadToGCS } from '@/lib/cloudStorage'

import { getChunksFromDoc } from '@/lib/loaders/genericDocLoader'
import { createDataSourceAndVectors } from '@/lib/loaders'
import { readFormData } from '@/lib/utils'

const DSType = DataSourceType.file
const IMAGE_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
]

// Upload local file flow
export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const contentType = req.headers.get('content-type')

  if (!contentType) {
    return new Response('Bad Request', { status: 400 })
  }

  try {
    if (IMAGE_CONTENT_TYPES.includes(contentType)) {
      const blob = await req.blob()
      const fileName = req.headers.get('x-file-name') || 'unnamed-image'
      const url =
        'https://pjrjxbdononaezaz.public.blob.vercel-storage.com/Screenshot%202024-08-04%20at%2015.58.42-LkasOKfDi5fmhsk0Wfkg7DFuTxBz5L.png'
      return NextResponse.json({ url, fileName })
    }

    const file = new File([await req.arrayBuffer()], 'uploaded-file')
    const chunks = await getChunksFromDoc({ file, DSType })

    if (!chunks?.length) {
      return new NextResponse('File is empty', { status: 400 })
    }

    // @TODO: read data and process it

    return NextResponse.json({ chunks })
  } catch (err) {
    console.error('File Upload Error:: ', err)

    return new NextResponse('Unsupported file type', {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

type ProcessFileUpload = {
  file: File
  userId: string
  chunks: Document[]
}

async function processFileUpload({ file, userId, chunks }: ProcessFileUpload) {
  const createDSResponse = await createDataSourceAndVectors({
    file,
    userId,
    chunks,
    DSType,
  })

  const { docs, dataSource } = createDSResponse || {}

  if (!dataSource || !docs?.length) {
    return null
  }

  // @TODO: modify this... We get the dataSourceId from the first doc(chunk)
  const { dataSourceId, ...metadata } = docs[0]?.metadata

  await uploadToGCS({
    uploadedFile: file,
    userId,
    dataSourceId,
    DSType,
    metadata: {
      title: file?.name,
      ...metadata,
    },
  })
}
