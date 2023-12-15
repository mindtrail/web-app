import { Buffer } from 'buffer'
import { Storage } from '@google-cloud/storage'
import { DataSource, DataSourceType } from '@prisma/client'

interface UploadToGCSProps {
  uploadedFile: File | HTMLFile
  userId: string
  dataSourceId: string
  type: DataSourceType
}

const storage = new Storage()
const bucketName = process.env.GCS_BUCKET_NAME || ''

export async function downloadWebsiteGCS(
  uri: string,
): Promise<Partial<HTMLFile> | null> {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(uri)
  try {
    const html = (await file.download()).toString()

    const result: Partial<HTMLFile> = {
      html,
      uri,
    }

    return result
  } catch (error) {
    console.error('Error downloading from GCS', error)
    return null
  }
}

// Return Blob or null
export async function getFileFromGCS(uri: string): Promise<Blob | null> {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(uri)
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
  const { uploadedFile, userId, dataSourceId } = props
  const uri = `${userId}/${dataSourceId}-${uploadedFile.name}`

  const bucket = storage.bucket(bucketName)
  const newFile = bucket.file(uri)

  try {
    const buffer = Buffer.from(await uploadedFile.arrayBuffer())
    await newFile.save(buffer)

    await newFile.setMetadata({
      metadata: {
        title: uploadedFile.name,
        dataSourceId,
        userId,
      },
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
        const path = `${userId}`
        const uri =
          type === 'file'
            ? `${path}/${dataSourceId}-${name}`
            : `${path}/${name}`

        return bucket.file(uri).delete()
      }),
    )

    return 'Files deleted successfully from GCS'
  } catch (error) {
    console.error('Error deleting from GCS', error)
    return error
  }
}
