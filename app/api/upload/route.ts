import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from 'lib/authOptions'
import { getFileLoader } from '@/lib/fileLoader'

// import { S3 } from '@aws-sdk/client-s3'

const FILE_TYPE = {
  PDF: 'application/pdf',
  TXT: 'text/plain',
  OCTET_STREAM: 'application/octet-stream',
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    console.log('Unauthorized')
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  // get the form data
  const data = await req.formData()
  console.log('data', data)
  // const AWS_KEY = process.env.AWS_KEY

  // const s3 = new S3({})
  // map through all the entries
  for (const value of Array.from(data.values())) {
    // FormDataEntryValue can either be type `Blob` or `string`.
    // If its type is object then it's a Blob
    const isFile = typeof value == 'object'

    if (isFile) {
      const blob = value as Blob
      const fileLoader = getFileLoader(blob)
      
      if (!fileLoader) {
        console.log('blob', blob)
        return NextResponse.json({ error: 'File type not supported' })
      }

      console.log(fileLoader)
      const docs = await fileLoader.load()

      console.log('docs', docs)

      return NextResponse.json({ docs })


        const pdfLoader = new PDFLoader(blob, { splitPages: false })
        const docs = await pdfLoader.load()
        // console.log('docs', docs)

        return NextResponse.json({ docs })

        // const params = {
        //   Bucket: 's3://arn:aws:s3:eu-central-1:641870435017:accesspoint/datauser1-ap/dataset1/',
        //   Key: AWS_KEY,
        //   Body: stream,
        // }
        // const result = await s3.upload(params).promise()

        // const res = await new Promise((resolve, reject) => {
        //   stream.pipe(process.stdout).on('finish', resolve).on('error', reject)
        // })
        // console.log('res', res)

        // create a buffer to store the contents of the file
        // const fileBuffer = Buffer.alloc(buffer.length)

        // // create a write stream to write the contents of the file to the buffer
        // const writeStream = new Writable({
        //   write(chunk, encoding, callback) {
        //     chunk.copy(fileBuffer, offset)
        //     offset += chunk.length
        //     callback()
        //   },
        // })

        // pipe the incoming stream to the write stream to write the contents of the file to the buffer
        // await new Promise((resolve, reject) => {
        //   stream.pipe(writeStream).on('finish', resolve).on('error', reject)
        // })

        // console.log(`File contents saved to memory: ${fileBuffer.toString()}`)
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

// Example usage:
