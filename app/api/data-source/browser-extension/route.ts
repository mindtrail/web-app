import { NextResponse } from 'next/server'
import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { Document } from 'langchain/document'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { createAndStoreVectors } from '@/lib/qdrant-langchain'
import { sumarizePage } from '@/lib/openAI'
import { cleanContent } from '@/lib/loaders/htmlLoader'

import { getChunksFromHTML } from '@/lib/loaders/htmlLoader'
import {
  createDataSource,
  updateDataSource,
  dataSourceExists,
} from '@/lib/db/dataSource'

// Function that processes the data received from the Browser Extension
// TODO: Add authentication

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

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
      userId,
      name: url,
      type: DataSourceType.web_page,
      nbChunks,
      textSize,
      summary,
      content: cleanContent(html),
      ...metadata,
    }

    const uniqueName = true

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
