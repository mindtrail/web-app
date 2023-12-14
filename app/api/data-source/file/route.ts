import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'

import { authOptions } from '@/lib/authOptions'
import { uploadToGCS } from '@/lib/cloudStorage'
import { updateDataSource } from '@/lib/db/dataSource'

import {
  processDataSourceCreation,
  storeVectorsAndUpdateDataSource,
} from '../utils'

// Upload file from the App

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

  const docs = await processDataSourceCreation(file, userId)

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

  await storeVectorsAndUpdateDataSource(docs)

  // TODO: !!!!
  // await uploadToGCS({ uploadedFile: file, userId, dataSourceId })

  return NextResponse.json({ docs })
}

const readFormData = async (req: Request) => {
  const formData = await req.formData()
  let file: File | null = null
  let collectionId = ''

  for (const value of Array.from(formData.values())) {
    // FormDataEntryValue can either be type `Blob` or `string`.
    // If its type is object then it's a Blob
    if (typeof value == 'object') {
      file = value
    }
    // If its type is string then it's the collectionId
    if (typeof value == 'string') {
      collectionId = value
    }
  }

  return { file, collectionId }
}
