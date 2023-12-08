import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceType, DataSourceStatus } from '@prisma/client'

import { authOptions } from '@/lib/authOptions'
import { uploadToGCS } from '@/lib/cloudStorage'
import { createDataSource, updateDataSource } from '@/lib/db/dataSource'
import { getChunksFromFile } from '@/lib/loaders/fileLoader'
import { createAndStoreVectors } from '@/lib/qdrant'

// Upload file from the App

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

  let collectionId = ''
  let uploadedFile: File | null = null

  const userId = session.user?.id
  const formData = await req.formData()

  for (const value of Array.from(formData.values())) {
    // FormDataEntryValue can either be type `Blob` or `string`.
    // If its type is object then it's a Blob
    if (typeof value == 'object') {
      uploadedFile = value
    }
    // If its type is string then it's the collectionId
    if (typeof value == 'string') {
      collectionId = value
    }
  }

  if (!uploadedFile) {
    return new Response(`Missing file.`, {
      status: 400,
    })
  }

  console.log('uploadedFile', uploadedFile)

  const { name: fileName = '' } = uploadedFile

  // Return nr of chunks & character count
  const docs = await getChunksFromFile(uploadedFile)

  if (docs instanceof Error) {
    // Handle the error case
    console.error(docs.message)
    return new NextResponse('Unsupported file type', {
      status: 400,
    })
  }

  const nbChunks = docs.length
  const textSize = docs.reduce((acc, doc) => acc + doc?.pageContent?.length, 0)

  const dataSourcePayload = {
    name: fileName,
    title: fileName,
    type: DataSourceType.file,
    nbChunks,
    textSize,
    // content: cleanContent(content),
    // collectionId,
    // ownerId: userId,
  }

  const dataSource = await createDataSource(dataSourcePayload)
  const dataSourceId = dataSource?.id

  if (!dataSourceId) {
    return new Response(`Failed to save File. Try again`, {
      status: 400,
    })
  }

  createAndStoreVectors({ docs, userId, dataSourceId })

  try {
    // Upload file to GCS
    // @TODO: change collectionID ...
    await uploadToGCS({ uploadedFile, userId, dataSourceId })
    updateDataSource({ id: dataSourceId, status: DataSourceStatus.synched })
  } catch (err) {
    // @TODO: return file upload success, and run the rest of the process in the background
    updateDataSource({ id: dataSourceId, status: DataSourceStatus.error })
    console.error(err)
  }

  return NextResponse.json({ nbChunks, textSize, docs })
}
