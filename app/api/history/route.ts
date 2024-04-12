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

  // var b = {
  //   'vercel-build':
  //     "sed -i 's/nativeLib = require(`@lancedb\\/lancedb-\\${currentTarget()}`);/nativeLib = require(`@lancedb\\/lancedb-linux-x64-gnu`);/' node_modules/@lancedb/lancedb/native.js && next build",
  // }

  try {
    const dataSourceList = await searchSimilarText(searchQuery)

    console.time('lance:')

    switch (searchQuery) {
      case 'init':
        console.log('init')
        await Lance.initDB()
        break
      case 'insert':
        console.log('insert')
        await Lance.insertVector()
        break
      case 'index':
        console.log('index')
        await Lance.buildIndex()
        break
      case 'search':
        console.log('search')
        await Lance.searchVector()
      default:
        break
    }
    // await Lance.searchVectorANN()
    console.timeEnd('lance:')

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
