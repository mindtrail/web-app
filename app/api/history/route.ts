import { getServerSession } from 'next-auth/next'
import * as cheerio from 'cheerio'

import { authOptions } from '@/lib/authOptions'
import { searchSimilarText } from '@/lib/qdrant-langchain'
import { getDataSrcById } from '@/lib/db/dataSrc'

const TEST_COLLECTION = 'bookmark-ai'

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

  try {
    console.log(searchQuery)
    const websiteFound = await searchSimilarText(searchQuery, TEST_COLLECTION)

    if (!websiteFound) {
      return new Response('No website found', {
        status: 404,
      })
    }

    const { dataSrcId, fileName: url } = websiteFound
    const dataSrc = await getDataSrcById(dataSrcId)

    const image = await getOGImage([url])

    console.log(image)

    return Response.json({
      ...websiteFound,
      image: image[0],
      summary: dataSrc?.summary,
    })
    // return callLangchainChat({ searchQuery, chatId, userId })
  } catch (error) {
    console.error('An error occurred:', error)

    return new Response('Server Error', {
      status: 500,
    })
  }
}

async function getOGImage(foundWebsites: string[]) {
  const websitesData = await Promise.all(
    foundWebsites.map(async (website) => {
      try {
        const res = await fetch(website)
        const html = await res.text()

        const $ = cheerio.load(html)
        const image = $('meta[property="og:image"]').attr('content')

        return image
      } catch (error) {
        console.error(error)
        return ''
      }
    }),
  )

  return websitesData.filter((website) => website !== null)
}
