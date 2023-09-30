import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import { authOptions } from '@/lib/authOptions'
import { getWebsiteData } from '@/lib/cloudStorage'
import { getChunksFromHTML } from '@/lib/htmlLoader'
import { DataSrcType } from '@prisma/client'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSrc'
import { createAndStoreVectors } from '@/lib/qdrant-langchain'
import { Document } from 'langchain/document'

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
  const timestamp = Date.now()

  try {
    const body = (await req.json()) as EmbeddingPayload

    console.time(`Embed website ${timestamp}`)
    const { dataStoreId, files } = body

    console.log('--- >', dataStoreId, files.length, JSON.stringify(files))

    // Download the files from GCS
    const filesHTML = await Promise.all(
      files.map(async (fileName) => await getWebsiteData(fileName)),
    )
    const validFiles = filesHTML.filter((file) => file !== null)

    // Constructed the chunks...
    const docsToStore = await Promise.all(
      validFiles.map(async (file) => {
        if (!file) {
          return null
        }
        const { storageMetadata, fileName } = file
        const { userId, dataStoreId } = storageMetadata

        const docs = await getChunksFromHTML(file)
        const nbChunks = docs.length
        const textSize = docs.reduce(
          (acc, doc) => acc + doc?.pageContent?.length,
          0,
        )

        const dataSrcPayload = {
          name: fileName,
          dataStoreId,
          ownerId: userId,
          type: DataSrcType.web_page,
          nbChunks,
          textSize,
        }

        const dataSrc = await createDataSrc(dataSrcPayload)
        const dataSrcId = dataSrc?.id

        if (!dataSrcId) {
          return null
        }

        return docs.map(({ pageContent, metadata }) => ({
          pageContent,
          metadata: {
            ...metadata,
            dataStoreId,
            dataSrcId,
            userId,
          },
        }))
      }),
    )

    const docs = docsToStore.flat(2).filter((doc) => doc !== null) as Document[]

    console.log(docs)
    await createAndStoreVectors({ docs })

    return NextResponse.json({
      result: `${docsToStore.length} dataSrcs Created`,
    })
  } catch (err) {
    console.error('errr', err)
    return new NextResponse('Somethin went wrong', {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
