'use server'

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { generateSignedUrl } from '@/lib/cloudStorage'
import { buildGCSFilePath } from '@/lib/utils'

import {
  deleteDataSourceDbOp,
  addDataSourcesToCollectionDbOp,
  removeDataSourceFromCollectionDbOp,
  getCollectionsForDataSourceListDbOp,
} from '@/lib/db/dataSource'
import { deleteFileFromGCS } from '@/lib/cloudStorage'
import { deleteVectorsForDataSource } from '@/lib/qdrant-langchain'

const env = process.env.NODE_ENV
const SCRAPER_SERVICE_URL =
  env === 'development'
    ? process.env.LOCAL_SCRAPER_SERVICE_URL
    : process.env.SCRAPER_SERVICE_URL

async function checkAuthUser() {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    throw new Error('Unauthorized')
  }

  return userId
}

function genericErrorHandler(error: any) {
  console.error(400, 500, error)

  if (error?.message === 'Unauthorized') {
    return {
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    }
  }

  if (error?.message === 'Not found') {
    return {
      error: {
        status: 404,
        message: 'Not found',
      },
    }
  }

  return {
    error: {
      status: 500,
      message: error?.message,
    },
  }
}
export const scrapeURLs = async (urls: string[], collectionId?: string) => {
  console.log('scrapeURLs', urls, collectionId)

  if (!urls?.length) {
    return {
      error: {
        status: 400,
        message: 'Invalid request, No URL provided',
      },
    }
  }

  if (!SCRAPER_SERVICE_URL) {
    return {
      error: {
        status: 500,
        message: 'Scraper service URL not set',
      },
    }
  }

  try {
    const userId = await checkAuthUser()

    const result = await fetch(SCRAPER_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls, collectionId, userId, limit: 5 }),
    })

    const res = await result?.json()

    return res
  } catch (error) {
    return genericErrorHandler(error)
  }
}

type AddItemsInFolder = {
  id: string
  dataSourceIdList: string[]
}

export const addDataSourcesToCollection = async (props: AddItemsInFolder) => {
  const { id: collectionId, dataSourceIdList } = props

  if (!dataSourceIdList?.length || !collectionId) {
    return {
      error: {
        status: 400,
        message: 'Invalid request, No DataSources or Folder provided',
      },
    }
  }

  try {
    await checkAuthUser()

    return await addDataSourcesToCollectionDbOp(dataSourceIdList, collectionId)
  } catch (error: any) {
    error?.message === 'Error adding dataSources to collection'
    return genericErrorHandler(error)
  }
}

type deletePayload = {
  dataSourceIdList: string[]
}

export async function deleteDataSource({ dataSourceIdList }: deletePayload) {
  try {
    const userId = await checkAuthUser()
    const deletedDataSources = await deleteDataSourceDbOp(dataSourceIdList, userId)

    deleteFileFromGCS(deletedDataSources, userId)
    deleteVectorsForDataSource(dataSourceIdList)

    return { deletedDataSources }
  } catch (error) {
    return genericErrorHandler(error)
  }
}

type RemoveDSFromCollection = {
  id: string
  dataSourceIdList: string[]
}

export async function removeDataSourceFromCollection(props: RemoveDSFromCollection) {
  const { id: collectionId, dataSourceIdList } = props

  try {
    await checkAuthUser()

    const result = await removeDataSourceFromCollectionDbOp(
      dataSourceIdList,
      collectionId,
    )

    return result
  } catch (error) {
    return genericErrorHandler(error)
  }
}

export async function getCollectionsForDataSourceList(dataSourceIdList: string[]) {
  try {
    await checkAuthUser()
    const result = await getCollectionsForDataSourceListDbOp(dataSourceIdList)
    return result as string[]
  } catch (error) {
    return genericErrorHandler(error)
  }
}

export async function getFileFromGCS(item: HistoryItem) {
  try {
    const userId = await checkAuthUser()

    const { id: dataSourceId, type: DSType, name } = item

    const GCS_PATH = buildGCSFilePath({ dataSourceId, DSType, name, userId })
    const filePath = await generateSignedUrl(GCS_PATH)

    return filePath
  } catch (error) {
    return genericErrorHandler(error)
  }
}

export async function canRenderInIFrame(url: string) {
  try {
    await checkAuthUser()

    const response = await fetch(url)
    const XFrameOptions = response.headers.get('x-frame-options')
    const CSP = response.headers.get('content-security-policy') || ''

    const frameAncestorsMatch = CSP.match('frame-ancestors')
    const ancestorSelf = CSP.match('self')

    // Check if we have any restrictions on x-frame-options
    if (XFrameOptions || (frameAncestorsMatch && ancestorSelf)) {
      return false
    }

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
