import { NextResponse } from 'next/server'
import { DataSrcType, DataSrcStatus } from '@prisma/client'

import { uploadToGCS } from '@/lib/cloudStorage'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSource'
import { createAndStoreVectors } from '@/lib/qdrant'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''

interface EmbeddingPayload {
  userId: string
  dataStoreId: string
  urls: string[]
}

export async function POST(req: Request) {
  // This will be a call from a Cloud Run service, from the same project & VPC
  // I want to make this call accessible only from the Cloud Run service
  const secret = req.headers.get('X-Custom-Secret')
  if (secret !== EMBEDDING_SECRET) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  let body

  try {
    body = (await req.json()) as EmbeddingPayload
  } catch (err) {
    console.error(err)
    return new Response('Bad Request', {
      status: 400,
    })
  }
  const { userId, dataStoreId, urls } = body

  // Return nr of chunks & character count
  const docs = {} // await getChunksFromFile(fileBlob)

  if (docs instanceof Error) {
    // Handle the error case
    console.error(docs.message)
    return new NextResponse('Unsupported file type', {
      status: 400,
    })
  }

  return NextResponse.json({ 1234: '1234' })

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

  // Upload file to S3
  const s3Upload = uploadToGCS({ fileBlob, userId, dataStoreId, dataSrcId })
  // @TODO: return file upload success, and run the rest of the process in the background
  s3Upload
    .then((res) => {
      updateDataSrc({ id: dataSrcId, status: DataSrcStatus.synched })
    })
    .catch((err) => {
      updateDataSrc({ id: dataSrcId, status: DataSrcStatus.error })
      console.error(err)
    })

  return NextResponse.json({ nbChunks, textSize, docs })
}
