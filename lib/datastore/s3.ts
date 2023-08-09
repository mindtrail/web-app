import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Buffer } from 'buffer'
import dotenv from 'dotenv'

dotenv.config()

const s3Client = new S3Client({
  region: 'eu-central-1',
  endpoint: 'https://s3.eu-central-1.amazonaws.com',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export async function uploadToS3(fileBlob: Blob, userId: string) {
  const { name } = fileBlob
  const key = `dataset1/${userId}/${name}-${Date.now().toString()}`

  const buffer = Buffer.from(await fileBlob.arrayBuffer())

  const command = new PutObjectCommand({
    Bucket: 'indie-chat',
    Key: key,
    Body: buffer,
  })

  try {
    console.time('s3')
    const response = await s3Client.send(command)
    console.timeEnd('s3')
    return response
  } catch (error) {
    console.error('Error uploading to S3', error)
  }
}
