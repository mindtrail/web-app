import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from 'lib/authOptions'
import { uploadFile } from '@/lib/datastore'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const data = await req.formData()

  // map through all the entries
  for (const value of Array.from(data.values())) {
    // FormDataEntryValue can either be type `Blob` or `string`.
    // If its type is object then it's a Blob
    const isFile = typeof value == 'object'

    if (isFile) {
      const blob = value as Blob
      const response = await uploadFile(blob)

      if (!response) {
        console.log('blob', blob)
        return NextResponse.json({ error: 'File type not supported' })
      }

      console.log('response', response)

      return NextResponse.json({ response })
    }
  }

  // return the response after all the entries have been processed.
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  // const body = await req.json()

  console.log('delete ')
  return NextResponse.json({ success: true })
}
