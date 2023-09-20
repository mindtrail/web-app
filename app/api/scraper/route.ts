import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

const env = process.env.NODE_ENV

const SCRAPER_URL =
  env === 'development'
    ? 'http://localhost:80' // Local scraper
    : 'https://indies-scraper-jgnk6lxbhq-ey.a.run.app' // deployed scraper
const SCRAPER_LIMIT = 10

// Method to initiate scraping
export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  const reqUrl = new URL(req.url)

  const urls = reqUrl.searchParams.getAll('urls')
  const dataStoreId = reqUrl.searchParams.get('dataStoreId')

  if (!urls) {
    return new NextResponse('No url provided', {
      status: 400,
    })
  }

  try {
    // Join array elements into a repeated parameters string
    const urlsParams = urls
      .map((url) => `urls=${encodeURIComponent(url)}`)
      .join('&')

    const scraperUrl = `${SCRAPER_URL}?${urlsParams}&limit=${SCRAPER_LIMIT}&dataStoreId=${dataStoreId}&userId=${userId}`

    const result = await fetch(scraperUrl)

    if (!result.ok) {
      return new Response('Failed to scrape', {
        status: 500,
      })
    }

    const res = await result?.json()
    console.log('res ---', res)

    return NextResponse.json(res)
  } catch (e) {
    console.log('error', e)

    return new NextResponse('Failed to scrape', {
      status: 500,
    })
  }
}
