import { NextResponse } from 'next/server'
import { Document } from 'langchain/document'
import { DataSourceType } from '@prisma/client'

import { createDataSourceAndVectors } from '@/lib/loaders'
import { downloadWebsiteGCS } from '@/lib/cloudStorage'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''

// @TODO: call from a Cloud Run service, from the same project & VPC
// Make this call accessible only from the same VPC
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

    const docs = await Promise.all(
      websites.map(async ({ uri: storageuri, metadata }) => {
        const { url, ...restMetadata } = metadata

        // Download the files from GCS
        const file = (await downloadWebsiteGCS(storageuri)) as HTMLFile
        file.metadata = restMetadata

        if (!file) {
          return null
        }

        return await createDataSourceAndVectors({
          file,
          userId,
          type: DataSourceType.web_page,
        })
      }),
    )

    const filteredDocs = docs
      ?.flat()
      ?.filter((doc) => doc !== null) as Document[]

    if (!filteredDocs?.length) {
      return new NextResponse('No docs', {
        status: 400,
      })
    }

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
