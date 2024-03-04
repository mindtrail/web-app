export const PREVIEW_URL = '/api/preview'

export async function getWebsitePreview(url: string) {
  const response = await fetch(`${PREVIEW_URL}?url=${url}`)

  console.log(response)

  if (!response.ok) {
    throw new Error('Cannot preview in iFrame')
  }

  return response.text()
}
