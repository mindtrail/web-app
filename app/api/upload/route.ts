import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSrcType, DataSrcStatus } from '@prisma/client'

import { authOptions } from '@/lib/authOptions'
import { uploadToGCS } from '@/lib/cloudStorage'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSrc'
import { getChunksFromFile } from '@/lib/fileLoader'
import { createAndStoreVectors } from '@/lib/qdrant'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
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

  let dataStoreId = ''
  let fileBlob: Blob | null = null

  const userId = session.user?.id
  const formData = await req.formData()

  for (const value of Array.from(formData.values())) {
    // FormDataEntryValue can either be type `Blob` or `string`.
    // If its type is object then it's a Blob
    if (typeof value == 'object') {
      fileBlob = value
    }
    // If its type is string then it's the dataStoreId
    if (typeof value == 'string') {
      dataStoreId = value
    }
  }

  if (!fileBlob || !dataStoreId) {
    return new Response(`Missing ${!fileBlob ? 'file' : 'dataStoreId'}`, {
      status: 400,
    })
  }

  const { name: fileName = '' } = fileBlob

  // Return nr of chunks & character count
  const docs = await getChunksFromFile(fileBlob)

  if (docs instanceof Error) {
    // Handle the error case
    console.error(docs.message)
    return new NextResponse('Unsupported file type', {
      status: 400,
    })
  }

  const nbChunks = docs.length
  const textSize = docs.reduce((acc, doc) => acc + doc?.pageContent?.length, 0)

  const dataSrcPayload = {
    name: fileName,
    dataStoreId,
    ownerId: userId,
    type: DataSrcType.file,
    nbChunks,
    textSize,
  }

  const dataSrc = await createDataSrc(dataSrcPayload)
  const dataSrcId = dataSrc?.id

  if (!dataSrcId) {
    return new Response(`Failed to save File. Try again`, {
      status: 400,
    })
  }

  createAndStoreVectors({ docs, userId, dataStoreId, dataSrcId })

  try {
    await uploadToGCS({ fileBlob, userId, dataStoreId, dataSrcId })
    updateDataSrc({ id: dataSrcId, status: DataSrcStatus.synched })
  } catch (err) {
    // @TODO: return file upload success, and run the rest of the process in the background
    updateDataSrc({ id: dataSrcId, status: DataSrcStatus.error })
    console.error(err)
  }

  return NextResponse.json({ nbChunks, textSize, docs })
}

// NOT LOG_ID("cloudaudit.googleapis.com/activity") AND NOT LOG_ID("externalaudit.googleapis.com/activity") AND NOT LOG_ID("cloudaudit.googleapis.com/system_event") AND NOT LOG_ID("externalaudit.googleapis.com/system_event") AND NOT LOG_ID("cloudaudit.googleapis.com/access_transparency") AND NOT LOG_ID("externalaudit.googleapis.com/access_transparency")
