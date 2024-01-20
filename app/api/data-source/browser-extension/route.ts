import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceType } from '@prisma/client'

import { getChunksFromDoc } from '@/lib/loaders/genericDocLoader'
import { authOptions } from '@/lib/authOptions'
import { dataSourceExists } from '@/lib/db/dataSource'
import { createDataSourceAndVectors } from '@/lib/loaders'
import { uploadToGCS } from '@/lib/cloudStorage'

const DSType = DataSourceType.web_page
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
    console.log(1111, body)

    const { html, ...metadata } = body
    const { url } = metadata

    console.log('--- Creating DataSources for URL ---> ', url)

    const existingDataSource = await dataSourceExists(url, userId)
    if (existingDataSource) {
      console.log('existingDataSource', existingDataSource)
      return NextResponse.json({
        status: 200,
        message: existingDataSource,
      })
    }

    const file = {
      name: url,
      html,
      metadata,
    }

    const chunks = await getChunksFromDoc({ file, DSType })

    if (!chunks?.length) {
      return new NextResponse('File is empty', {
        status: 400,
      })
    }

    const docs = await createDataSourceAndVectors({
      file,
      userId,
      chunks,
      DSType,
    })

    if (!docs?.length) {
      return new NextResponse('No docs', {
        status: 400,
      })
    }

    // We get the dataSourceId from the first doc(chunk)
    const { dataSourceId } = docs[0]?.metadata

    await uploadToGCS({
      uploadedFile: file,
      userId,
      dataSourceId,
      metadata,
      DSType,
    })

    return NextResponse.json({
      result: `DataSource & ${docs.length} vectors Created`,
    })
  } catch (err) {
    console.error('Browser Extension Error::', err)
    return new NextResponse('Somethin went wrong', {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
