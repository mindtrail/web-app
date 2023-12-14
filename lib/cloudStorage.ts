import { Buffer } from 'buffer'
import { Storage } from '@google-cloud/storage'
import { DataSource } from '@prisma/client'

interface UploadToGCSProps {
  uploadedFile: File
  userId: string
  dataSourceId: string
}

const storage = new Storage()
const bucketName = process.env.GCS_BUCKET_NAME || ''

export async function downloadWebsiteGCS(
  fileName: string,
): Promise<Partial<HTMLFile> | null> {
  const bucket = storage.bucket(bucketName)
  const file = bucket.file(fileName)
  try {
    const html = (await file.download()).toString()

    const result: Partial<HTMLFile> = {
      html,
      fileName,
    }

    return result
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
  const { uploadedFile, userId, dataSourceId } = props
  const fileName = `${userId}/${dataSourceId}-${uploadedFile.name}`

  const bucket = storage.bucket(bucketName)
  const newFile = bucket.file(fileName)

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
        const fileName =
          type === 'file'
            ? `${path}/${dataSourceId}-${name}`
            : `${path}/${name}`

        return bucket.file(fileName).delete()
      }),
    )

    return 'Files deleted successfully from GCS'
  } catch (error) {
    console.error('Error deleting from GCS', error)
    return error
  }
}
