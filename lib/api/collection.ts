export const DATASTORE_ENDPOINT = '/api/collection'

export async function createCollectionApiCall(data: CreateCollection) {
  const response = await fetch(DATASTORE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const newCollection = await response.json()
  if (!newCollection) {
    throw new Error('Failed to create Collection')
  }

  return newCollection
}

export async function updateCollectionApiCall(
  collectionId: string,
  data: Partial<CreateCollection>,
) {
  const response = await fetch(`${DATASTORE_ENDPOINT}/${collectionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const updatedCollection = await response.json()
  if (!updatedCollection) {
    throw new Error('Failed to update Collection')
  }

  return updatedCollection
}

export const deleteCollectionApiCall = async (collectionId: string) => {
  const response = await fetch(`${DATASTORE_ENDPOINT}/${collectionId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete data store ${collectionId}`)
  }

  return response.json()
}
