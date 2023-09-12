export const DATASTORE_ENDPOINT = '/api/datastore'
export const UPLOAD_ENDPOINT = '/api/upload'
export const METADATA_ENDPOINT = '/api/upload/metadata'
export const SCRAPER_ENDPOINT = '/api/scraper'

export async function createDataStoreApiCall(data: CreateDataStore) {
  const response = await fetch(DATASTORE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const newDataStore = await response.json()
  if (!newDataStore) {
    throw new Error('Failed to create DataStore')
  }

  return newDataStore
}

export async function updateDataStoreApiCall(
  dataStoreId: string,
  data: Partial<CreateDataStore>,
) {
  const response = await fetch(`${DATASTORE_ENDPOINT}/${dataStoreId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const updatedDataStore = await response.json()
  if (!updatedDataStore) {
    throw new Error('Failed to update DataStore')
  }

  return updatedDataStore
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

export const scrapeURLsApiCall = async (urls: string, dataStoreId: string) => {
  const response = await fetch(
    `${SCRAPER_ENDPOINT}?urls=${urls}&dataStoreId=${dataStoreId}`,
  )

  if (!response.ok) {
    throw new Error(`Failed to scrape URLs`)
  }

  return response.text()
}
