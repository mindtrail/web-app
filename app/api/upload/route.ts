import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { uploadFile } from '@/lib/dataStore'
import { ExtendedSession } from '@/lib/types'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const userId = session.user?.id

  const formData = await req.formData()

  console.log('formData', formData)
  const response = await uploadFile(formData, userId)

  if (!response) {
    return NextResponse.json({ error: 'File type not supported' })
  }

  // console.log('response', response)
  return NextResponse.json({ response })

  // return the response after all the entries have been processed.
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  // const body = await req.json()

  console.log('delete ')
  return NextResponse.json({ success: true })
}
