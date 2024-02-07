import { NextResponse } from 'next/server'
import { Document } from 'langchain/document'
import { DataSourceType } from '@prisma/client'

import { getChunksFromDoc } from '@/lib/loaders/genericDocLoader'
import { createDataSourceAndVectors } from '@/lib/loaders'
import { downloadWebsiteFromGCS } from '@/lib/cloudStorage'

const EMBEDDING_SECRET = process.env.EMBEDDING_SECRET || ''
const DSType = DataSourceType.web_page

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

    console.log('Create DS from Scrapped URLs --- >', websites.length)

    const docs = await Promise.all(
      websites.map(async ({ name: gcFileName, metadata }) => {
        const { url, ...restMetadata } = metadata

        // Download the html from GCS
        const html = await downloadWebsiteFromGCS(gcFileName)
        const file = {
          name: url,
          html,
          metadata: restMetadata,
        } as HTMLFile

        if (!file) {
          return null
        }

        const chunks = await getChunksFromDoc({ file, DSType })
        if (!chunks?.length) {
          return null
        }

        return await createDataSourceAndVectors({
          file,
          userId,
          chunks,
          DSType,
        })
      }),
    )

    const filteredDocs = docs?.flat()?.filter((doc) => doc !== null) as Document[]

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
