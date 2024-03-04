import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { DataSourceType } from '@prisma/client'

import { authOptions } from '@/lib/authOptions'
import { buildGCSFilePath } from '@/lib/utils'

// Function that processes the data received from the Browser Extension
export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const url = new URL(req.url)
    const previewURL = (url.searchParams.get('url') as DataSourceType) || undefined

    if (!previewURL) {
      return new Response('Invalid URL', { status: 400 })
    }

    const websiteToCheck = await fetch(previewURL)

    // Check if we have any restrictions on x-frame-options
    if (websiteToCheck.headers.get('x-frame-options')) {
      return new Response('Invalid URL', { status: 400 })
    }
    return NextResponse.json('OK')
  } catch (error) {
    console.log(error)
    return new Response('Invalid URL', { status: 400 })
  }
}
