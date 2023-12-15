import * as cheerio from 'cheerio'
import { NextResponse } from 'next/server'

import { searchSimilarText } from '@/lib/qdrant-langchain'
import { getDataSourceById } from '@/lib/db/dataSource'

export async function searchHistory(searchQuery: string) {
  try {
    const websiteFound = await searchSimilarText(searchQuery)

    if (!websiteFound) {
      return new NextResponse('No website found', {
        status: 404,
      })
    }

    const { dataSourceId, name: url } = websiteFound
    const dataSource = await getDataSourceById(dataSourceId)
    const image = await getOGImage(url)

    return NextResponse.json({
      ...websiteFound,
      image,
      summary: dataSource?.summary || '',
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
