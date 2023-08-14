import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getDocumentChunks } from '@/lib/fileLoader'
import { ExtendedSession } from '@/lib/types'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  if (!req || !req.headers.get('content-type')?.startsWith('multipart/form-data')) {
    return new Response('Bad Request', {
      status: 400,
    })
  }

  let fileBlob: Blob | null = null

  const userId = session.user?.id
  const formData = await req.formData()

  for (const value of Array.from(formData.values())) {
    // FormDataEntryValue can either be type `Blob` or `string`.
    // If its type is object then it's a Blob
    if (typeof value == 'object') {
      fileBlob = value
    }
  }

  if (!fileBlob) {
    console.log('No FileBlob')
    return null
  }

  const { name: fileName = '' } = fileBlob

  // Return nr of chunks & character count
  const docs = await getDocumentChunks(fileBlob)

  const nbChunks = docs.length
  const charCount = docs.reduce((acc, doc) => acc + doc?.pageContent?.length, 0)

  if (!docs.length) {
    return NextResponse.json({ error: 'File type not supported' })
  }

  // console.log('response', response)
  return NextResponse.json(charCount)
}

export async function DELETE(req: Request) {
  // const body = await req.json()

  console.log('delete ')
  return NextResponse.json({ success: true })
}
