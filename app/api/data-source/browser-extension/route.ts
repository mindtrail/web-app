import { NextResponse } from 'next/server'
import { getChunksFromHTML } from '@/lib/loaders/htmlLoader'
import { DataSourceType, DataSourceStatus } from '@prisma/client'
import {
  createDataSource,
  updateDataSource,
  dataSourceExists,
} from '@/lib/db/dataSource'
import { createAndStoreVectors } from '@/lib/qdrant-langchain'
import { Document } from 'langchain/document'
import { sumarizePage, getPageCategory } from '@/lib/openAI'

import { cleanContent } from '@/lib/loaders/htmlLoader'

// Function that processes the data received from the Browser Extension
// TODO: Add authentication

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BrowserExtensionData
    const { url, html, ...metadata } = body

    console.log('--- Creating DataSources for URL ---> ', url)

    if (await dataSourceExists(url)) {
      return NextResponse.json({
        status: 200,
        message: 'DataSource already exists',
      })
    }

    const file = {
      fileName: url,
      html,
      metadata,
    }

    const { chunks: docs, sumaryContent } = await getChunksFromHTML(file)
    const nbChunks = docs.length
    const textSize = docs.reduce(
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
      type: DataSourceType.web_page,
      nbChunks,
      textSize,
      summary,
      content: cleanContent(html),
      ...metadata,
    }

    const uniqueName = true
    // @TODO: check if the dataSource already exists, and if the content has changed
    // If not, don't create a new dataSource, only update it, and keep the same vectors
    const dataSource = await createDataSource(dataSourcePayload, uniqueName)
    const dataSourceId = dataSource?.id

    if (!dataSourceId) {
      return new NextResponse('Empty docs', {
        status: 400,
      })
    }

    const documents = docs
      .map(({ pageContent, metadata }) => ({
        pageContent,
        metadata: {
          ...metadata,
          dataSourceId,
        },
      }))
      .filter((doc) => doc !== null) as Document[]

    if (!documents.length) {
      return new NextResponse('No docs', {
        status: 400,
      })
    }

    await createAndStoreVectors({
      docs: documents,
    })

    // Update the dataSource status to synched for each doc
    documents.map(({ metadata }) => {
      const { dataSourceId } = metadata
      updateDataSource({ id: dataSourceId, status: DataSourceStatus.synched })
    })

    return NextResponse.json({
      result: `DataSource & ${documents.length} vectors Created`,
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
