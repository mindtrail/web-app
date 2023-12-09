'use server'

import { getServerSession } from 'next-auth/next'
import { revalidateTag } from 'next/cache'
import { authOptions } from '@/lib/authOptions'

const env = process.env.NODE_ENV
const SCRAPER_SERVICE_URL =
  env === 'development'
    ? process.env.LOCAL_SCRAPER_SERVICE_URL
    : process.env.SCRAPER_SERVICE_URL

type deletePayload = {
  dataSourceId: string
}
export const scrapeURLs = async (urls: string[], collectionId?: string) => {
  console.log('scrapeURLs', urls, collectionId)

  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    console.error('Unauthorized')

    return {
      status: 401,
    }
  }

  if (!urls?.length) {
    console.error('Invalid request, No URL  provided')

    return {
      status: 400,
      message: 'Invalid request, No URL  provided',
    }
  }

  if (!SCRAPER_SERVICE_URL) {
    return {
      status: 500,
      message: 'Scraper service URL not set',
    }
  }

  try {
    const result = await fetch(SCRAPER_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls, collectionId, userId, limit: 2 }),
    })

    if (!result.ok) {
      console.log('Scrapper service Error', result.status)
      return {
        status: 500,
      }
    }

    const res = await result?.json()
    console.log('Scraper ---', res)

    return res
  } catch (e) {
    console.log('error', e)

    return new Response('Failed to scrape', {
      status: 500,
    })
  }
}
