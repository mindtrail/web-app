import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getDocumentChunks } from '@/lib/fileLoader'
import { ExtendedSession } from '@/lib/types'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
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

  // Return nr of chunks & character count
  const docs = await getDocumentChunks(fileBlob)

  if (docs instanceof Error) {
    // Handle the error case
    console.error(docs.message)
    return new NextResponse('Unsupported file type', {
      status: 400,
    })
  }

  const charCount = docs.reduce((acc, doc) => acc + doc?.pageContent?.length, 0)

  const { name, type } = fileBlob
  return NextResponse.json({ charCount, name, type })
}

export async function DELETE(req: Request) {
  // const body = await req.json()

  console.log('delete ')
  return NextResponse.json({ success: true })
}
