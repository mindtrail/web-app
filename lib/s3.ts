import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Buffer } from 'buffer'
import dotenv from 'dotenv'

dotenv.config()

const s3Client = new S3Client({
  region: 'eu-central-1',
  endpoint: 'https://s3.eu-central-1.amazonaws.com',
  credentials: {
    accessKeyId: process.env.AMAZON_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AMAZON_AWS_SECRET_ACCESS_KEY || '',
  },
})

interface UploadToS3Props {
  fileBlob: Blob
  userId: string
  dataStoreId: string
  dataSrcId: string
}

export async function uploadToS3(props: UploadToS3Props) {
  const { fileBlob, userId, dataStoreId, dataSrcId } = props

  const { name } = fileBlob
  const key = `dataset1/${userId}/${dataStoreId}/${dataSrcId}-${name}`

  const buffer = Buffer.from(await fileBlob.arrayBuffer())

  const command = new PutObjectCommand({
    Bucket: 'indie-chat',
    Key: key,
    Body: buffer,
    Metadata: {
      dataSrcId,
      dataStoreId,
      userId,
    },
  })

  try {
    console.time('s3')
    const response = await s3Client.send(command)
    console.timeEnd('s3')
    return response
  } catch (error) {
    console.error('Error uploading to S3', error)
    return null
  }
}
