import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { searchSimilarText } from '@/lib/qdrant-langchain'
import { searchSimilarTextPlain } from '@/lib/qdrant'
import { getDataSourceListByIdsDbOp } from '@/lib/db/dataSource'

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session.user?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const url = new URL(req.url)
  const searchQuery = url.searchParams.get('searchQuery')

  if (!searchQuery) {
    return new Response('No message provided', { status: 400 })
  }

  try {
    const dataSourceList = await searchSimilarTextPlain(searchQuery)

    if (!dataSourceList?.length) {
      return Response.json([])
    }
    const result = await getDataSourceListByIdsDbOp(dataSourceList, userId)

    return Response.json(result)
    // return callLangchainChat({ searchQuery, chatId, userId })
  } catch (error) {
    console.error('An error occurred:', error)

    return new Response('Server Error', { status: 500 })
  }
}
