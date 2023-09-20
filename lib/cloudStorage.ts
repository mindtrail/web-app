import { Buffer } from 'buffer'
import { Storage } from '@google-cloud/storage'

interface UploadToGCSProps {
  fileBlob: Blob
  userId: string
  dataStoreId: string
  dataSrcId: string
}

const storage = new Storage()

export async function uploadToGCS(props: UploadToGCSProps) {
  const { fileBlob, userId, dataStoreId, dataSrcId } = props

  const bucketName = process.env.GCS_BUCKET_NAME || ''
  const fileName = `${userId}/${dataStoreId}/${dataSrcId}-${fileBlob.name}`

  const bucket = storage.bucket(bucketName)
  const file = bucket.file(fileName)

  const buffer = Buffer.from(await fileBlob.arrayBuffer())

  try {
    console.time('GCS')
    await file.save(buffer)

    await file.setMetadata({
      metadata: {
        customTime: new Date().toISOString(),
        metadata: {
          dataSrcId,
          dataStoreId,
          userId,
        },
      },
    })
    console.timeEnd('GCS')

    return 'File uploaded successfully'
  } catch (error) {
    console.error('Error uploading to GCS', error)
    return null
  }
}
