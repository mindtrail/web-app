import { NextResponse } from 'next/server'
import { Document } from 'langchain/document'
import { DataSourceType } from '@prisma/client'

import { getChunksFromDoc } from '@/lib/loaders/genericDocLoader'
import { createDataSourceAndVectors } from '@/lib/loaders'
import { downloadWebsiteFromGCS } from '@/lib/cloudStorage'
import { getBaseResourceURL } from '@/lib/utils'

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
        const baseResourceURL = getBaseResourceURL(url)
        // Download the html from GCS
        const html = await downloadWebsiteFromGCS(gcFileName)
        const file = {
          html,
          name: baseResourceURL,
          metadata: restMetadata,
        } as HTMLFile


        if (!file) {
          return null
        }

        const chunks = await getChunksFromDoc({ file, DSType })
        if (!chunks?.length) {
          return null
        }

        const createDSResponse = await createDataSourceAndVectors({
          file,
          userId,
          chunks,
          DSType,
        })

        return createDSResponse?.docs
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
