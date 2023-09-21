import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

const env = process.env.NODE_ENV

const SCRAPER_URL =
  env === 'development'
    ? 'http://localhost:80' // Local scraper
    : 'https://indies-scraper-jgnk6lxbhq-ey.a.run.app' // deployed scraper

const FETCH_LINKS_URL = SCRAPER_URL + '/links'

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const reqUrl = new URL(req.url)

  // const urls = reqUrl.searchParams.get('urls')
  // const dataStoreId = reqUrl.searchParams.get('dataStoreId')
  const prefetchUrls = reqUrl.searchParams.get('prefetchUrls')

  if (prefetchUrls) {
    try {
      const result = await fetch(`${FETCH_LINKS_URL}?url=${prefetchUrls}`)
      if (!result.ok) {
        return new Response('Failed to fetch links', {
          status: 500,
        })
      }
    } catch (e) {
      console.log('error', e)
      return new Response('Failed to fetch links', {
        status: 500,
      })
    }
  }

  try {
  } catch (e) {
    console.log('error', e)
    return new Response('Failed to scrape', {
      status: 500,
    })
  }

  return new Response('ok', {
    status: 200,
  })
}
