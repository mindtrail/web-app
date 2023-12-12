import { NextResponse } from 'next/server'
import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'

import { downloadWebsiteGCS } from '@/lib/cloudStorage'
import { getChunksFromHTML } from '@/lib/loaders/htmlLoader'
import { createAndStoreVectors } from '@/lib/qdrant'
import { sumarizePage, getPageTags } from '@/lib/openAI'

import { createDataSource, updateDataSource } from '@/lib/db/dataSource'
import { createTags } from '@/lib/db/tags'

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

    const { userId, websites } = body

    console.log('Creating DataSources for Scrapped URLs --- >', websites.length)
    console.log(body)

    const documents = await Promise.all(
      websites.map(async ({ fileName: storageFileName, metadata }) => {
        const { url, ...restMetadata } = metadata

        // Download the files from GCS
        const file = (await downloadWebsiteGCS(storageFileName)) as HTMLFile
        file.metadata = restMetadata

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
        const tags = await getPageTags(summary)

        // We store the dataSource in the DB. Trying to store the content too, see how large it can be
        const dataSourcePayload = {
          userId,
          name: url,
          type: DataSourceType.web_page,
          nbChunks,
          textSize,
          summary,
          content: cleanContent(file.html),
          ...restMetadata,
        }

        const dataSource = await createDataSource(dataSourcePayload)
        const dataSourceId = dataSource?.id

        if (!dataSourceId) {
          return new NextResponse('Empty docs', {
            status: 400,
          })
        }

        await createTags({ tags, dataSourceId })

        return chunks.map(({ pageContent, metadata }) => ({
          pageContent,
          metadata: {
            ...metadata,
            dataSourceId,
            userId,
            tags,
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
