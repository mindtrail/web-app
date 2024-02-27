import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { DataSourceType } from '@prisma/client'

import { getDataSourceListDbOp } from '@/lib/db/dataSource'

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = new URL(req.url)
  const type = (url.searchParams.get('type') as DataSourceType) || undefined

  const DSList = await getDataSourceListDbOp({ userId, type })

  // For the call coming from the browser extension we only return the list of urls
  if (type === DataSourceType.web_page) {
    const urls = DSList.map((ds) => ds.name)

    return NextResponse.json(urls)
  }

  return NextResponse.json(DSList)
}
