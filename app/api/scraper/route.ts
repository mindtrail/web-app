import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

const env = process.env.NODE_ENV

const SCRAPER_SERVICE_URL =
  env === 'development'
    ? process.env.LOCAL_SCRAPER_SERVICE_URL
    : process.env.SCRAPER_SERVICE_URL

// Method to initiate scraping
export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }

  const body = await req.json()
  let { urls, dataStoreId } = body
  urls = typeof urls === 'string' ? [urls] : urls

  if (!urls?.length || !dataStoreId) {
    return new NextResponse('Invalid request, No URL or dataStoreId provided', {
      status: 400,
    })
  }

  if (!SCRAPER_SERVICE_URL) {
    return new NextResponse('Scraper service URL not set', {
      status: 500,
    })
  }

  try {
    const result = await fetch(SCRAPER_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls, dataStoreId, userId }),
    })

    if (!result.ok) {
      console.log('Scrapper service Error', result.status)
      return new Response('Failed to scrape', {
        status: 500,
      })
    }

    const res = await result?.json()
    console.log('Scraper ---', res)

    return NextResponse.json(res)
  } catch (e) {
    console.log('error', e)
    return new NextResponse('Failed to scrape', {
      status: 500,
    })
  }
}
