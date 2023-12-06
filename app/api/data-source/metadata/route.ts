import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getChunksFromFile } from '@/lib/fileLoader'

export async function POST(req: Request) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  if (
    !req ||
    !req.headers.get('content-type')?.startsWith('multipart/form-data')
  ) {
    return new Response('Bad Request', {
      status: 400,
    })
  }

  let uploadedFile: File | null = null

  const formData = await req.formData()
  for (const value of Array.from(formData.values())) {
    // FormDataEntryValue can either be type `Blob` or `string`.
    // If its type is object then it's a Blob
    if (typeof value == 'object') {
      uploadedFile = value
    }
  }

  if (!uploadedFile) {
    return new Response('Bad Request', {
      status: 400,
    })
  }

  // Return nr of chunks & character count
  const docs = await getChunksFromFile(uploadedFile)

  if (docs instanceof Error) {
    // Handle the error case
    console.error(docs.message)
    return new NextResponse('Unsupported file type', {
      status: 400,
    })
  }

  const charCount = docs.reduce((acc, doc) => acc + doc?.pageContent?.length, 0)

  const { name, type } = uploadedFile
  return NextResponse.json({ charCount, name, type })
}
