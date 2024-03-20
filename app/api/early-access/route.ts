import { NextResponse, NextRequest } from 'next/server'

import { createEarlyAccessDbOp } from '@/lib/db/earlyAccess'
import { isEmailValid } from '@/lib/utils'

const getCorsHeaders = (origin: string) => {
  const nodeEnv = process.env.NODE_ENV
  const allowedOrign = nodeEnv === 'development' ? '*' : 'https://www.mindtrail.ai'

  const headers = {
    'Access-Control-Allow-Methods': `GET, POST, OPTIONS`,
    'Access-Control-Allow-Headers': `Content-Type, Authorization`,
    'Access-Control-Allow-Origin': allowedOrign,
  }

  // If no allowed origin is set to default server origin
  if (!process.env.ALLOWED_ORIGIN || !origin) return headers

  // If allowed origin is set, check if origin is in allowed origins
  const allowedOrigins = process.env.ALLOWED_ORIGIN.split(',')

  // Validate server origin
  if (allowedOrigins.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*'
  } else if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  // Return result
  return headers
}

// Endpoints
// ========================================================
/**
 * Basic OPTIONS Request to simuluate OPTIONS preflight request for mutative requests
 */
export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: getCorsHeaders(request.headers.get('origin') || ''),
    },
  )
}

export async function POST(req: Request) {
  const payload = (await req.json()) as { email: string }

  console.log('EMAIL ---- EMAIL --- ', payload)

  const email = payload?.email

  // Validate the email address
  if (!email || !isEmailValid(email)) {
    return new Response('Please enter a valid email address', {
      status: 400,
    })
  }

  try {
    const result = await createEarlyAccessDbOp(payload?.email)
    console.log('RESULT ---- RESULT --- ', result)

    return NextResponse.json(
      { payload },
      {
        status: 200,
        headers: getCorsHeaders(req.headers.get('origin') || ''),
      },
    )
  } catch (error) {
    console.error(error)
    return new Response('Error creating collection', {
      status: 500,
    })
  }
}
