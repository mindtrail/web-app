export const DATASTORE_ENDPOINT = '/api/datastore'
export const UPLOAD_ENDPOINT = '/api/upload'
export const METADATA_ENDPOINT = '/api/upload/metadata'

type CreateDataStore = {
  userId: string
  name: string
  description: string
}

export async function createDataStoreApiCall({ userId, name, description }: CreateDataStore) {
  const response = await fetch(DATASTORE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      name,
      description,
    }),
  })
  const dataStore = await response.json()

  if (!dataStore) {
    throw new Error('Failed to create DataStore')
  }

  return dataStore
}

export async function uploadFileApiCall(file: File, dataStoreId: string) {
  const formData = new FormData()

  formData.append('files', file)
  formData.append('dataStoreId', dataStoreId)

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload files')
  }

  return response.json()
}

export async function getFileMetadataApiCall(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(METADATA_ENDPOINT, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload files')
  }

  return response.json()
}

export const deleteDataStoreApiCall = async (dataStoreId: string) => {
  const response = await fetch(`${DATASTORE_ENDPOINT}/${dataStoreId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete data store ${dataStoreId}`)
  }

  return response.json()
}

export const deleteFileApiCall = async (fileId: string) => {
  const response = await fetch(`${UPLOAD_ENDPOINT}/${fileId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete file ${fileId}`)
  }

  return response.json()
}
