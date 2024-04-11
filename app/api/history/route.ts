import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { searchSimilarText } from '@/lib/qdrant-langchain'
// import { searchSimilarTextPlain } from '@/lib/qdrant'
import * as Lance from '@/lib/lancedb'
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
    const dataSourceList = await searchSimilarText(searchQuery)

    // Lance.initiDB()
    // console.time('lance')
    // await Lance.searchVector()
    // await Lance.insertVector()
    // await Lance.buildIndex()
    // console.timeEnd('lance')

    console.time('lance ANN')
    await Lance.searchVectorANN()
    console.timeEnd('lance ANN')

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
