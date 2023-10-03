export const DATASTORE_ENDPOINT = '/api/datastore'

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

export const deleteDataStoreApiCall = async (dataStoreId: string) => {
  const response = await fetch(`${DATASTORE_ENDPOINT}/${dataStoreId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete data store ${dataStoreId}`)
  }

  return response.json()
}
