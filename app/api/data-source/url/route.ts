import { NextResponse } from 'next/server'
import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'

import { downloadFileGCS } from '@/lib/cloudStorage'
import { getChunksFromHTML } from '@/lib/loaders/htmlLoader'
import { createDataSource, updateDataSource } from '@/lib/db/dataSource'
import { createAndStoreVectors } from '@/lib/qdrant-langchain'
import { sumarizePage, getPageCategory } from '@/lib/openAI'

import { cleanContent } from '@/lib/loaders/htmlLoader'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''

// This processes the result from the scraper
// This will be a call from a Cloud Run service, from the same project & VPC
// I want to make this call accessible only from the Cloud Run service

export async function POST(req: Request) {
  const secret = req.headers.get('X-Custom-Secret')
  if (secret !== EMBEDDING_SECRET) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }
  const timestamp = Date.now()

  try {
    const body = (await req.json()) as ScrapingResult

    console.time(`Embed website ${timestamp}`)
    const { userId, collectionId, files } = body

    console.log('Creating DataSources for Scrapped URLs --- >', files.length)
    // Download the files from GCS
    const documents = await Promise.all(
      files.map(async ({ fileName, metadata }) => {
        const { url, content, ...restMetadata } = metadata

        const file = await downloadFileGCS(fileName)
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
        // const category = await getPageCategory(summary)

        const dataSourcePayload = {
          name: url,
          // collectionId,
          // ownerId: userId,
          type: DataSourceType.web_page,
          nbChunks,
          textSize,
          summary,
          // thumbnail: category,
          content: cleanContent(content),
          ...restMetadata,
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
