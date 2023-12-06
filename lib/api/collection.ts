export const DATASTORE_ENDPOINT = '/api/collection'

export async function createCollectionApiCall(data: CreateCollection) {
  const response = await fetch(DATASTORE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const newDataStore = await response.json()
  if (!newDataStore) {
    throw new Error('Failed to create Collection')
  }

  return newDataStore
}

export async function updateCollectionApiCall(
  dataStoreId: string,
  data: Partial<CreateCollection>,
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
    throw new Error('Failed to update Collection')
  }

  return updatedDataStore
}

export const deleteCollectionApiCall = async (dataStoreId: string) => {
  const response = await fetch(`${DATASTORE_ENDPOINT}/${dataStoreId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete data store ${dataStoreId}`)
  }

  return response.json()
}
