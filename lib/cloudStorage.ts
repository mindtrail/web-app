import { Buffer } from 'buffer'
import { Storage } from '@google-cloud/storage'
import { DataSource, DataSourceType } from '@prisma/client'

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
  let { uploadedFile, userId, dataSourceId, type, metadata } = props
  const { name } = uploadedFile

  let gcFileName = ''
  let contentType = ''
  let fileContent

  try {
    if (type === DataSourceType.file) {
      uploadedFile = uploadedFile as File

      contentType = uploadedFile.type
      gcFileName = `${userId}/files/${dataSourceId}/${name}`
      fileContent = Buffer.from(await uploadedFile.arrayBuffer())
    } else {
      uploadedFile = uploadedFile as HTMLFile

      contentType = 'text/html'
      gcFileName = getGCSPathFromURL(name, userId)
      fileContent = uploadedFile.html
    }

    const bucket = storage.bucket(bucketName)
    const newFile = bucket.file(gcFileName)
    await newFile.save(fileContent)

    console.log(1111, gcFileName, metadata)

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
        const gcFileName = buildFilePath(userId, dataSourceId, name, type)

        return bucket.file(gcFileName).delete()
      }),
    )

    return 'Files deleted successfully from GCS'
  } catch (error) {
    console.error('Error deleting from GCS', error)
    return error
  }
}

const getGCSPathFromURL = (url: string, userId: string) => {
  const urlObj = new URL(url)
  const { hostname } = urlObj

  let pathname = urlObj.pathname.substring(1).replace(/\s+|\//g, '-') || 'index'
  pathname = pathname.endsWith('-') ? pathname.slice(0, -1) : pathname

  return `${userId}/websites/${hostname}/${pathname}`
}

const buildFilePath = (
  userId: string,
  dataSourceId: string,
  name: string,
  type: DataSourceType,
) => {
  if (type === DataSourceType.file) {
    return `${userId}/files/${dataSourceId}/${name}`
  } else {
    return getGCSPathFromURL(name, userId)
  }
  //`${userId}/websites/${name}`
}
