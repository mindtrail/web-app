export const HISTORY = '/api/history'

export const deleteHistoryEntryApiCall = async (id: string) => {
  const response = await fetch(`${HISTORY}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete file ${id}`)
  }

  return response.json()
}
