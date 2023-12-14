import { NextResponse } from 'next/server'
import { Document } from 'langchain/document'

import { downloadWebsiteGCS } from '@/lib/cloudStorage'

import {
  processDataSourceCreation,
  storeVectorsAndUpdateDataSource,
} from '../utils'

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

  try {
    const body = (await req.json()) as ScrapingResult
    const { userId, websites } = body

    console.log('Creating DataSources for Scrapped URLs --- >', websites.length)

    const documents = await Promise.all(
      websites.map(async ({ fileName: storageFileName, metadata }) => {
        const { url, ...restMetadata } = metadata

        // Download the files from GCS
        const file = (await downloadWebsiteGCS(storageFileName)) as HTMLFile
        file.metadata = restMetadata

        if (!file) {
          return null
        }

        return await processDataSourceCreation(file, userId)
      }),
    )

    const filteredDocs = documents
      ?.flat()
      ?.filter((doc) => doc !== null) as Document[]

    if (!documents?.length) {
      return new NextResponse('No docs', {
        status: 400,
      })
    }

    await storeVectorsAndUpdateDataSource(filteredDocs)

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
