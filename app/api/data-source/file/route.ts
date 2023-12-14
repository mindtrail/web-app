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

  const docs = await createDataSourceAndVectors({
    file,
    type: DataSourceType.file,
    userId,
  })

  if (docs instanceof Error) {
    // Handle the error case
    console.error(docs.message)
    return new NextResponse(docs.message, {
      status: 400,
    })
  }
  if (!docs?.length) {
    return new NextResponse('No docs', {
      status: 400,
    })
  }
  // TODO: !!!!
  // await uploadToGCS({ uploadedFile: file, userId, dataSourceId })

  return NextResponse.json({ docs })
}
