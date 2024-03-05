import { Buffer } from 'buffer'
import { Storage } from '@google-cloud/storage'
import { DataSource, DataSourceType } from '@prisma/client'

import { buildGCSFilePath } from '@/lib/utils'

const storage = new Storage()
const bucketName = process.env.GCS_BUCKET_NAME || ''

export async function downloadWebsiteFromGCS(
  gcFileName: string,
): Promise<Partial<string> | null> {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(gcFileName)
  try {
    return (await file.download()).toString()
  } catch (error) {
    console.error('Error downloading from GCS', error)
    return null
  }
}

export async function generateSignedUrl(gcFileName: string): Promise<string | null> {
  try {
    const expires = Date.now() + 5 * 60 * 1000 // Expiration time in milliseconds.
    const file = storage.bucket(bucketName)?.file(gcFileName)

    const [url] = await file?.getSignedUrl({ action: 'read', expires })
    return url
  } catch (error) {
    console.error('Error downloading from GCS', error)
    return null
  }
}

interface UploadToGCSProps {
  uploadedFile: File | HTMLFile
  userId: string
  dataSourceId: string
  DSType: DataSourceType
  metadata?: Partial<BrowserExtensionData>
}

export async function uploadToGCS(props: UploadToGCSProps) {
  try {
    const { uploadedFile, userId, dataSourceId, DSType, metadata } = props
    const { name } = uploadedFile
    const gcFileName = buildGCSFilePath({ userId, dataSourceId, name, DSType })

    let contentType = ''
    let fileContent

    if (DSType === DataSourceType.file) {
      const file = uploadedFile as File

      contentType = file.type
      fileContent = Buffer.from(await file.arrayBuffer())
    } else {
      const file = uploadedFile as HTMLFile

      contentType = 'text/html'
      fileContent = file.html
    }

    const bucket = storage.bucket(bucketName)
    const newFile = bucket.file(gcFileName)
    await newFile.save(fileContent)

    newFile.setMetadata({
      contentType, // @ts-ignore
      metadata,
    })

    return 'File uploaded successfully'
  } catch (error) {
    console.error('Error uploading to GCS', error)
    return null
  }
}

export async function deleteFileFromGCS(dataSourceList: DataSource[], userId: string) {
  try {
    await Promise.all(
      dataSourceList.map((dataSource) => {
        const { id: dataSourceId, type: DSType, name } = dataSource

        const bucket = storage.bucket(bucketName)
        const gcFileName = buildGCSFilePath({
          userId,
          dataSourceId,
          name,
          DSType,
        })

        console.log('Detelet GCS', gcFileName)
        const result = bucket.file(gcFileName).delete()
        // console.log('result', result)
        return result
      }),
    )

    return 'Files deleted successfully from GCS'
  } catch (error) {
    console.error('Error deleting from GCS', error)
    return error
  }
}
