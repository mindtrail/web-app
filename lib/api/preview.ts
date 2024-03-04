export const PREVIEW_URL = '/api/preview'

export async function getWebsitePreview(url: string) {
  const response = await fetch(`${PREVIEW_URL}?url=${url}`)

  if (!response.ok) {
    throw new Error('Failed to upload files')
  }

  return response.text()
}
