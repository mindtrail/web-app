import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceType } from '@prisma/client'

import { authOptions } from '@/lib/authOptions'
import { uploadToS3 } from '@/lib/s3'
import { createDataSource } from '@/lib/dataSource'
import { getDocumentChunks } from '@/lib/fileLoader'
import { ExtendedSession } from '@/lib/types'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
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
      dataStoreId = JSON.parse(value)?.dataStoreId
    }
  }

  if (!dataStoreId || !fileBlob) {
    console.log('No dataStoreId')
    return null
  }

  const { name: fileName = '' } = fileBlob

  // Return nr of chunks & character count
  const docs = await getDocumentChunks(fileBlob)

  const nbChunks = docs.length
  const textSize = docs.reduce((acc, doc) => acc + doc?.pageContent?.length, 0)

  const dataSourcePayload = {
    name: fileName,
    dataStoreId,
    ownerId: userId,
    type: DataSourceType.file,
    nbChunks,
    textSize,
  }

  const dataSource = await createDataSource(dataSourcePayload)
  console.log(dataSource)

  // Upload file to S3
  const s3Upload = uploadToS3({ fileBlob, userId, dataStoreId, dataSourceId: dataSource.id })
  // @TODO: return file upload success, and run the rest of the process in the background
  s3Upload.then((res) => {
    console.log('res', res)
  })

  if (!docs.length) {
    return NextResponse.json({ error: 'File type not supported' })
  }

  // console.log('response', response)
  return NextResponse.json({ nbChunks, textSize, docs })
}

export async function DELETE(req: Request) {
  // const body = await req.json()

  console.log('delete ')
  return NextResponse.json({ success: true })
}
