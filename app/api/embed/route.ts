import { NextResponse } from 'next/server'
import { getWebsiteData } from '@/lib/cloudStorage'
import { getChunksFromHTML } from '@/lib/htmlLoader'
import { DataSrcType, DataSrcStatus } from '@prisma/client'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSrc'
import { createAndStoreVectors } from '@/lib/qdrant-langchain'
import { Document } from 'langchain/document'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''
const WEB_PAGE_REGEX = /(?:[^\/]+\/){2}(.+)/ // Matches everything after the second slash

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
    const { userId, dataStoreId, files } = body

    console.log('--- >', dataStoreId, files.length, JSON.stringify(files))
    // Download the files from GCS
    const documents = await Promise.all(
      files.map(async (fileName) => {
        const file = await getWebsiteData(fileName)
        if (!file) {
          return null
        }

        const docs = await getChunksFromHTML(file)
        const nbChunks = docs.length
        const textSize = docs.reduce(
          (acc, doc) => acc + doc?.pageContent?.length,
          0,
        )

        if (!nbChunks || !textSize) {
          return null
        }

        const match = fileName.match(WEB_PAGE_REGEX)
        const dataSrcPayload = {
          name: match ? match[1] : fileName,
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
            dataSrcId,
          },
        }))
      }),
    )

    if (!documents.length) {
      return new NextResponse('No docs', {
        status: 400,
      })
    }

    const filteredDocs = documents
      .flat()
      .filter((doc) => doc !== null) as Document[]

    await createAndStoreVectors({
      docs: filteredDocs,
      collectionName: `${userId}-${dataStoreId}`,
    })

    // Update the dataSrc status to synched for each doc
    filteredDocs.map(({ metadata }) => {
      const { dataSrcId } = metadata
      updateDataSrc({ id: dataSrcId, status: DataSrcStatus.synched })
    })

    return NextResponse.json({
      result: `${filteredDocs.length} dataSrcs Created`,
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
