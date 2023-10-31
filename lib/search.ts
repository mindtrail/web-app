import * as cheerio from 'cheerio'
import { NextResponse } from 'next/server'

import { searchSimilarText } from '@/lib/qdrant-langchain'
import { getDataSrcById } from '@/lib/db/dataSrc'

const TEST_COLLECTION = 'bookmark-ai'

type ResultItem = {
  title: string
  description: string
  image: string
}

type props = {
  searchQuery: string
}

export async function searchHistory(searchQuery: string) {
  try {
    const websiteFound = await searchSimilarText(searchQuery, TEST_COLLECTION)

    if (!websiteFound) {
      return new NextResponse('No website found', {
        status: 404,
      })
    }

    console.log(1234, searchQuery)
    const { dataSrcId, fileName: url } = websiteFound
    const dataSrc = await getDataSrcById(dataSrcId)
    const image = await getOGImage(url)

    return NextResponse.json({
      ...websiteFound,
      image,
      summary: dataSrc?.summary || '',
    })
  } catch (error) {
    console.error('An error occurred:', error)

    return new NextResponse('Server Error', {
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
