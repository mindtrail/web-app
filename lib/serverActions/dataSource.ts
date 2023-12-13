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
    return {
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    }
  }

  if (!urls?.length) {
    return {
      error: {
        status: 400,
        message: 'Invalid request, No URL provided',
      },
    }
  }

  if (!SCRAPER_SERVICE_URL) {
    return {
      error: {
        status: 500,
        message: 'Scraper service URL not set',
      },
    }
  }

  try {
    const result = await fetch(SCRAPER_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls, collectionId, userId, limit: 10 }),
    })

    const res = await result?.json()
    console.log('Scraper ---', res)

    return res
  } catch (e) {
    console.log('Error ---', e)

    return {
      error: {
        status: 500,
        message: 'Scraper service Error',
      },
    }
  }
}
