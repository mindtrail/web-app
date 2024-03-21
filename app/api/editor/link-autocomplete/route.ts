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
  console.log(reqURL)

  const linkToFetch = validateAndPrependUrl(reqURL.searchParams.get('url') as string)

  try {
    const response = {
      success: true,
      items: [
        {
          href: 'https://mindtrail.ai',
          name: 'Mindtrail',
          description: 'Something cool seeing here',
        },
        {
          href: 'https://codex.so/editor',
          name: 'Codex Editor',
          description: '',
        },
        {
          href: 'https://codex.so/media',
          name: 'Codex Media',
          description: '',
        },
      ],
    }
    return NextResponse.json(response)
  } catch (err) {
    console.log('Error fetching link from DB', err)
    const response = {
      success: 0,
      link: linkToFetch,
      meta: {},
    }

    return NextResponse.json(response)
  }
}
