import { NextResponse } from 'next/server'
import { getChunksFromHTML } from '@/lib/htmlLoader'
import { DataSrcType, DataSrcStatus } from '@prisma/client'
import { createDataSrc, updateDataSrc } from '@/lib/db/dataSrc'
import { createAndStoreVectors } from '@/lib/qdrant-langchain'
import { Document } from 'langchain/document'
import { sumarizePage } from '@/lib/openAI'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''
const TEST_USER_ID = process.env.TEST_USER_ID || ''
const TEST_DATASTORE_ID = process.env.TEST_DATASTORE_ID || ''

interface EmbeddingDocPayload {
  // userId: string
  html: string
  url: string
  storageMetadata: StorageMetadata
}

export async function POST(req: Request) {
  // This will be a call from a Cloud Run service, from the same project & VPC
  // I want to make this call accessible only from the Cloud Run service

  // const secret = req.headers.get('X-Custom-Secret')
  // if (secret !== EMBEDDING_SECRET) {
  //   return new Response('Unauthorized', {
  //     status: 401,
  //   })
  // }

  try {
    const body = (await req.json()) as EmbeddingDocPayload

    const timestamp = Date.now()
    console.time(`Embed website ${timestamp}`)
    const { html, url: fileName, storageMetadata } = body

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

    const dataSrcPayload = {
      name: fileName,
      dataStoreId: TEST_DATASTORE_ID,
      ownerId: TEST_USER_ID,
      type: DataSrcType.web_page,
      nbChunks,
      textSize,
      summary,
    }

    const uniqueName = true
    const dataSrc = await createDataSrc(dataSrcPayload, uniqueName)
    const dataSrcId = dataSrc?.id

    if (!dataSrcId) {
      return new NextResponse('Empty docs', {
        status: 400,
      })
    }

    const documents = docs
      .map(({ pageContent, metadata }) => ({
        pageContent,
        metadata: {
          ...metadata,
          dataSrcId,
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

    // Update the dataSrc status to synched for each doc
    documents.map(({ metadata }) => {
      const { dataSrcId } = metadata
      updateDataSrc({ id: dataSrcId, status: DataSrcStatus.synched })
    })

    return NextResponse.json({
      result: `${documents.length} dataSrcs Created`,
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
