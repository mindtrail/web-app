import { NextResponse } from 'next/server'
import { getWebsiteData } from '@/lib/cloudStorage'
import { getChunksFromHTML } from '@/lib/htmlLoader'
import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { createDataSource, updateDataSource } from '@/lib/db/dataSource'
import { createAndStoreVectors } from '@/lib/qdrant-langchain'
import { Document } from 'langchain/document'
import { sumarizePage, getPageCategory } from '@/lib/openAI'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''
const WEB_PAGE_REGEX = /(?:[^\/]+\/){2}(.+)/ // Matches everything after the second slash

// THIS IS EMBEDDING FILES FROM GCS

interface EmbeddingPayload {
  userId: string
  collectionId: string
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
    const { userId, collectionId, files } = body

    console.log('--- >', collectionId, files.length, JSON.stringify(files))
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
        const dataSourcePayload = {
          name: match ? match[1] : fileName,
          collectionId,
          ownerId: userId,
          type: DataSourceType.web_page,
          nbChunks,
          textSize,
          summary,
          thumbnail: category,
        }

        const dataSource = await createDataSource(dataSourcePayload)
        const dataSourceId = dataSource?.id

        if (!dataSourceId) {
          return new NextResponse('Empty docs', {
            status: 400,
          })
        }

        return chunks.map(({ pageContent, metadata }) => ({
          pageContent,
          metadata: {
            ...metadata,
            dataSourceId,
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
      collectionName: `${userId}-${collectionId}`,
    })

    // Update the dataSource status to synched for each doc
    filteredDocs.map(({ metadata }) => {
      const { dataSourceId } = metadata
      updateDataSource({ id: dataSourceId, status: DataSourceStatus.synched })
    })

    return NextResponse.json({
      result: `${filteredDocs.length} dataSources Created`,
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
