import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceType } from '@prisma/client'

import { authOptions } from '@/lib/authOptions'
import { uploadToGCS } from '@/lib/cloudStorage'

import { createDataSourceAndVectors } from '@/lib/loaders'
import { readFormData } from '@/lib/utils'

// Upload local file flow
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

  const payload = {
    file,
    userId,
  }

  processFileUpload(payload)
  return NextResponse.json({ payload })
}

type ProcessFileUpload = {
  file: File
  userId: string
}

async function processFileUpload({ file, userId }: ProcessFileUpload) {
  try {
    const docs = await createDataSourceAndVectors({
      file,
      userId,
      DSType: DataSourceType.file,
    })

    if (!docs?.length) {
      return new NextResponse('File is empty', {
        status: 400,
      })
    }

    // We get the dataSourceId from the first doc(chunk)
    const { dataSourceId, ...metadata } = docs[0]?.metadata

    console.log('File Upload', metadata)

    await uploadToGCS({
      uploadedFile: file,
      userId,
      dataSourceId,
      metadata: {
        title: file?.name,
        ...metadata,
      },
      type: DataSourceType.file,
    })
  } catch (err) {
    // Handle the error case
    console.error('File Upload Error:: ', err)
    return new NextResponse('Unsupported file type', {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
