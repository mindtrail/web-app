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
    const websiteFound = await searchSimilarText(searchQuery, TEST_COLLECTION)

    if (!websiteFound) {
      return new Response('No website found', {
        status: 404,
      })
    }

    const { dataSrcId, fileName: url } = websiteFound
    const dataSrc = await getDataSrcById(dataSrcId)
    const image = await getOGImage(url)

    return Response.json({
      ...websiteFound,
      image,
      summary: dataSrc?.summary || '',
    })
    // return callLangchainChat({ searchQuery, chatId, userId })
  } catch (error) {
    console.error('An error occurred:', error)

    return new Response('Server Error', {
      status: 500,
    })
  }
}

async function getOGImage(website: string) {
  try {
    const res = await fetchWithTimeout(website)
    const html = await res.text()

    const $ = cheerio.load(html)
    const image = $('meta[property="og:image"]').attr('content')

    return image
  } catch (err) {
    return ''
  }
}

async function fetchWithTimeout(url: string) {
  const timeout = 1500

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(url, {
    signal: controller.signal,
  })
  clearTimeout(id)

  return response
}
