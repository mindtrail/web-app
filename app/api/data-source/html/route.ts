import { NextResponse } from 'next/server'
import { getChunksFromHTML } from '@/lib/loaders/htmlLoader'
import { DataSourceType, DataSourceStatus } from '@prisma/client'
import { createDataSource, updateDataSource } from '@/lib/db/dataSource'
import { createAndStoreVectors } from '@/lib/qdrant-langchain'
import { Document } from 'langchain/document'
import { sumarizePage, getPageCategory } from '@/lib/openAI'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''
const TEST_USER_ID = process.env.TEST_USER_ID || ''
const TEST_DATASTORE_ID = process.env.TEST_DATASTORE_ID || ''

// Function that processes the data received from the Browser Extension
// We need to store to GCS and then process the data

export async function POST(req: Request) {
  // const secret = req.headers.get('X-Custom-Secret')
  // if (secret !== EMBEDDING_SECRET) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //   })
  // }

  try {
    const body = (await req.json()) as BrowserExtensionData

    const timestamp = Date.now()
    console.time(`Embed website ${timestamp}`)
    const { url: fileName } = body

    const { url, title, description, content, image, autoSave } =
      body as BrowserExtensionData

    // Download the files from GCS
    const payload = {
      fileName,
      html,
      storageMetadata,
    }

    const { chunks: docs, sumaryContent } = await getChunksFromHTML(payload)
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
    const category = await getPageCategory(summary)

    const dataSourcePayload = {
      name: fileName,
      collectionId: TEST_DATASTORE_ID,
      ownerId: TEST_USER_ID,
      type: DataSourceType.web_page,
      nbChunks,
      textSize,
      summary,
      thumbnail: category,
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
      collectionName: `bookmark-ai`,
    })

    // Update the dataSource status to synched for each doc
    documents.map(({ metadata }) => {
      const { dataSourceId } = metadata
      updateDataSource({ id: dataSourceId, status: DataSourceStatus.synched })
    })

    return NextResponse.json({
      result: `${documents.length} dataSources Created`,
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
