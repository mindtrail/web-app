import { Buffer } from 'buffer'
import { Storage } from '@google-cloud/storage'

interface UploadToGCSProps {
  fileBlob: Blob
  userId: string
  dataStoreId: string
  dataSrcId: string
}

const storage = new Storage()
const bucketName = process.env.GCS_BUCKET_NAME || ''

export async function getWebsiteData(
  fileName: string,
): Promise<HTMLFile | null> {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(fileName)
  try {
    const html = (await file.download()).toString()
    const [metadata] = await file.getMetadata()

    return {
      html,
      fileName,
      storageMetadata: metadata?.metadata || {},
    }
  } catch (error) {
    console.error('Error downloading from GCS', error)
    return null
  }
}

// Return Blob or null
export async function getFileFromGCS(fileName: string): Promise<Blob | null> {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(fileName)
  try {
    const [fileBuffer] = await file.download()
    const blob = new Blob([fileBuffer], { type: 'text/html' })

    return blob
  } catch (error) {
    console.error('Error downloading from GCS', error)
    return null
  }
}

export async function uploadToGCS(props: UploadToGCSProps) {
  const { fileBlob, userId, dataStoreId, dataSrcId } = props
  const fileName = `${userId}/${dataStoreId}/${dataSrcId}-${fileBlob.name}`

  const bucket = storage.bucket(bucketName)
  const newFile = bucket.file(fileName)

  try {
    const buffer = Buffer.from(await fileBlob.arrayBuffer())
    await newFile.save(buffer)

    await newFile.setMetadata({
      metadata: {
        customTime: new Date().toISOString(),
        metadata: {
          dataSrcId,
          dataStoreId,
          userId,
        },
      },
    })

    return 'File uploaded successfully'
  } catch (error) {
    console.error('Error uploading to GCS', error)
    return null
  }
}
