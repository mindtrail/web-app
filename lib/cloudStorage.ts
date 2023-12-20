import { Buffer } from 'buffer'
import { Storage } from '@google-cloud/storage'
import { DataSource, DataSourceType } from '@prisma/client'

import { buildFilePath, GCS_ACTION_TYPE } from '@/lib/utils'

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

interface UploadToGCSProps {
  uploadedFile: File | HTMLFile
  userId: string
  dataSourceId: string
  type: DataSourceType
  metadata?: Partial<WEB_Data>
}

export async function uploadToGCS(props: UploadToGCSProps) {
  try {
    const { uploadedFile, userId, dataSourceId, type, metadata } = props
    const { name } = uploadedFile
    const gcFileName = buildFilePath({ userId, dataSourceId, name, type })

    let contentType = ''
    let fileContent

    if (type === DataSourceType.file) {
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

    await newFile.setMetadata({
      contentType,
      metadata,
    })

    return 'File uploaded successfully'
  } catch (error) {
    console.error('Error uploading to GCS', error)
    return null
  }
}

export async function deleteFileFromGCS(
  dataSourceList: DataSource[],
  userId: string,
) {
  try {
    await Promise.all(
      dataSourceList.map((dataSource) => {
        const { id: dataSourceId, type, name } = dataSource

        const bucket = storage.bucket(bucketName)
        const gcFileName = buildFilePath({
          userId,
          dataSourceId,
          name,
          type,
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
