import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { dataSourceExists } from '@/lib/db/dataSource'

import {
  processDataSourceCreation,
  storeVectorsAndUpdateDataSource,
} from '../utils'

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

    const docs = await processDataSourceCreation(file, userId)

    if (!docs?.length) {
      return new NextResponse('No docs', {
        status: 400,
      })
    }

    await storeVectorsAndUpdateDataSource(docs)

    return NextResponse.json({
      result: `DataSource & ${docs.length} vectors Created`,
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
