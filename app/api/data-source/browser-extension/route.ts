import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceType } from '@prisma/client'

import { getChunksFromDoc } from '@/lib/loaders/genericDocLoader'
import { authOptions } from '@/lib/authOptions'
import { checkDataSourceExists } from '@/lib/db/dataSource'
import { createDataSourceAndVectors } from '@/lib/loaders'
import { uploadToGCS } from '@/lib/cloudStorage'

const DSType = DataSourceType.web_page

// Function that processes the data received from the Browser Extension
export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const body = (await req.json()) as BrowserExtensionData

    const { html, ...metadata } = body
    const { url } = metadata

    console.log('--- Creating DataSources for URL ---> ', url)

    const existingDataSource = await checkDataSourceExists(url, userId)
    if (existingDataSource) {
      return NextResponse.json({
        result: 'DataSource already exists',
        dataSource: existingDataSource,
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

    const createDSResponse = await createDataSourceAndVectors({
      file,
      userId,
      chunks,
      DSType,
    })

    const { docs, dataSource } = createDSResponse || {}
    if (!dataSource || !docs?.length) {
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
      dataSource,
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
