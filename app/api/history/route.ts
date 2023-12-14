import { getServerSession } from 'next-auth/next'
import * as cheerio from 'cheerio'

import { authOptions } from '@/lib/authOptions'
import { searchSimilarText } from '@/lib/qdrant-langchain'
import { getDataSourceListByIds } from '@/lib/db/dataSource'

type ResultItem = {
  title: string
  description: string
  image: string
}

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session.user?.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const body = await req.json()
  const { searchQuery } = body

  if (!searchQuery) {
    return new Response('No message provided', {
      status: 400,
    })
  }

  console.log('searchQuery:::', searchQuery)
  try {
    const dataSourceList = await searchSimilarText(searchQuery)

    if (!dataSourceList) {
      return new Response('No website found', {
        status: 404,
      })
    }
    const result = await getDataSourceListByIds(dataSourceList)

    return Response.json(result)
    // return callLangchainChat({ searchQuery, chatId, userId })
  } catch (error) {
    console.error('An error occurred:', error)

    return new Response('Server Error', {
      status: 500,
    })
  }
}
