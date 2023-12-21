import { NextResponse } from 'next/server'

export const DATA_SRC = '/api/data-source'
export const UPLOAD_ENDPOINT = '/api/data-source/file'
export const METADATA_ENDPOINT = '/api/data-source/metadata'
export const SCRAPER_ENDPOINT = '/api/scraper'

export async function uploadFileApiCall(file: File) {
  const formData = new FormData()
  formData.append('files', file)

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
  formData.append('files', file)

  const response = await fetch(METADATA_ENDPOINT, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    if (response.status === 400) {
      const response = { textSize: 0, name: file.name, type: file.type }
      return response
    }

    if (response.status === 403) {
      throw new Error('Unsupported file type')
    }
  }

  return response.json()
}

export const deleteDataSourceApiCall = async (fileId: string) => {
  const response = await fetch(`${DATA_SRC}/${fileId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete file ${fileId}`)
  }

  return response.json()
}

export const scrapeURLsApiCall = async (
  urls: string[],
  collectionId?: string,
) => {
  const response = await fetch(SCRAPER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // @TODO: add limit to number of urls
    body: JSON.stringify({ urls, collectionId }),
  })

  if (!response.ok) {
    console.log('response', response)
    throw new Error(`Failed to scrape URLs`)
  }

  return response.json()
}
