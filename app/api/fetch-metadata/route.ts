import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import * as cheerio from 'cheerio'

import { authOptions } from '@/lib/authOptions'
import { validateAndPrependUrl } from '@/lib/utils'

export async function GET(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const reqURL = new URL(req.url)
  const linkToFetch = validateAndPrependUrl(reqURL.searchParams.get('url') as string)

  try {
    console.log('LINK ---- URL --- ', linkToFetch)
    if (!linkToFetch) {
      return new Response('Please enter a valid URL', {
        status: 400,
      })
    }

    const loadedWebsite = await fetch(linkToFetch)
    const html = await loadedWebsite.text()
    const $ = cheerio.load(html)

    // Extract metadata using cheerio
    const title = $('title').text() || $('meta[property="og:title"]').attr('content')
    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content')
    const image = $('meta[property="og:image"]').attr('content')

    const metadata = {
      title,
      site_name:
        $('meta[property="og:site_name"]').attr('content') ||
        new URL(linkToFetch).hostname,
      description,
      image: {
        url: image || '',
      },
    }

    const response = {
      success: 1,
      type: 'linkTool',
      link: linkToFetch,
      meta: metadata,
    }

    return NextResponse.json(response)
  } catch (err) {
    console.log('Error fetching metadata', err)
    const response = {
      success: 0,
      link: linkToFetch,
      meta: {},
    }

    return NextResponse.json(response)
  }
}
