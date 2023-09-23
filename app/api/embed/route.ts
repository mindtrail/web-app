import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/authOptions'
import { getWebsite } from '@/lib/cloudStorage'
import { getChunksFromHTML } from '@/lib/htmlLoader'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''

interface EmbeddingPayload {
  userId: string
  dataStoreId: string
  files: string[]
  bucket: string
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

  try {
    const body = (await req.json()) as EmbeddingPayload
    console.time('getWebsite')
    const { dataStoreId, files } = body
    console.log('--- >', dataStoreId, files.length, JSON.stringify(files))

    // Download the files from GCS
    const filesHTML = await Promise.all(
      files.map(async (fileName) => await getWebsite(fileName)),
    )
    const validFiles = filesHTML.filter((file) => file !== null)

    // Constructed the chunks...
    const chunks = await Promise.all(
      validFiles.map(async (file) => {
        if (!file) {
          return null
        }
        return await getChunksFromHTML(file)
      }),
    )

    const result = chunks.filter((chunk) => chunk !== null).flat()
    // console.log('--- >', result)

    console.log(result.length)
    console.timeEnd('getWebsite')
    return NextResponse.json(result)
  } catch (err) {
    console.error(err)
    return new Response('Bad Request', {
      status: 400,
    })
  }
}
