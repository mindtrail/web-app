import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Buffer } from 'buffer'
import dotenv from 'dotenv'

dotenv.config()

// @TODO: make this dynamic
const USER_NAME = 'test-user'

const s3Client = new S3Client({
  region: 'eu-central-1',
  endpoint: 'https://s3.eu-central-1.amazonaws.com',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export async function uploadToS3(fileBlob: Blob) {
  const { name } = fileBlob
  const key = `dataset1/${USER_NAME}-${name}-${Date.now().toString()}`

  const buffer = Buffer.from(await fileBlob.arrayBuffer())

  console.log('buffer', buffer)
  const command = new PutObjectCommand({
    Bucket: 'indie-chat',
    Key: key,
    Body: buffer,
  })

  try {
    const response = await s3Client.send(command)
    console.log('s3', response)
    return response
  } catch (error) {
    console.error('Error uploading to S3', error)
  }
}
