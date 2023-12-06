import { NextResponse } from 'next/server'
import { getWebsiteData } from '@/lib/cloudStorage'
import { getChunksFromHTML } from '@/lib/htmlLoader'
import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSource'
import { createAndStoreVectors } from '@/lib/qdrant-langchain'
import { Document } from 'langchain/document'
import { sumarizePage, getPageCategory } from '@/lib/openAI'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''
const WEB_PAGE_REGEX = /(?:[^\/]+\/){2}(.+)/ // Matches everything after the second slash

// THIS IS EMBEDDING FILES FROM GCS

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

        const { chunks, sumaryContent } = await getChunksFromHTML(file)
        const nbChunks = chunks.length
        const textSize = chunks.reduce(
          (acc, doc) => acc + doc?.pageContent?.length,
          0,
        )

        if (!nbChunks || !textSize) {
          return new NextResponse('Empty docs', {
            status: 400,
          })
        }
        const summary = await sumarizePage(sumaryContent)
        const category = await getPageCategory(summary)

        const match = fileName.match(WEB_PAGE_REGEX)
        const dataSrcPayload = {
          name: match ? match[1] : fileName,
          dataStoreId,
          ownerId: userId,
          type: DataSourceType.web_page,
          nbChunks,
          textSize,
          summary,
          thumbnail: category,
        }

        const dataSource = await createDataSrc(dataSrcPayload)
        const dataSrcId = dataSource?.id

        if (!dataSrcId) {
          return new NextResponse('Empty docs', {
            status: 400,
          })
        }

        return chunks.map(({ pageContent, metadata }) => ({
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

    // Update the dataSource status to synched for each doc
    filteredDocs.map(({ metadata }) => {
      const { dataSrcId } = metadata
      updateDataSrc({ id: dataSrcId, status: DataSourceStatus.synched })
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
