'use server'

import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { downloadWebsiteFromGCS } from '@/lib/cloudStorage'
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

export const scrapeURLs = async (urls: string[], collectionId?: string) => {
  console.log('scrapeURLs', urls, collectionId)

  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return {
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    }
  }

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
    const result = await fetch(SCRAPER_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls, collectionId, userId, limit: 5 }),
    })

    const res = await result?.json()

    return res
  } catch (e) {
    console.log('Error ---', e)

    return {
      error: {
        status: 500,
        message: 'Scraper service Error',
      },
    }
  }
}

type AddItemsInFolder = {
  id: string
  dataSourceIdList: string[]
}

export const addDataSourcesToCollection = async (props: AddItemsInFolder) => {
  const { id: collectionId, dataSourceIdList } = props

  console.log('addDataSourcesToCollection', dataSourceIdList, collectionId)
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return {
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    }
  }

  if (!dataSourceIdList?.length || !collectionId) {
    return {
      error: {
        status: 400,
        message: 'Invalid request, No DataSources or Folder provided',
      },
    }
  }

  try {
    return await addDataSourcesToCollectionDbOp(dataSourceIdList, collectionId)
  } catch (e) {
    console.log('Error ---', e)
    const result = {
      error: {
        status: 500,
        message: 'Error adding DataSources to Collection',
      },
    }

    console.log(result)
    return result
  }
}

type deletePayload = {
  dataSourceIdList: string[]
}

export async function deleteDataSource({ dataSourceIdList }: deletePayload) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return {
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    }
  }

  try {
    const deletedDataSources = await deleteDataSourceDbOp(dataSourceIdList, userId)

    deleteFileFromGCS(deletedDataSources, userId)
    deleteVectorsForDataSource(dataSourceIdList)

    return { deletedDataSources }
  } catch (error) {
    console.log(2222, 'errrr')
    return { status: 404 }
  }
}

type RemoveDSFromCollection = {
  id: string
  dataSourceIdList: string[]
}

export async function removeDataSourceFromCollection(props: RemoveDSFromCollection) {
  const { id: collectionId, dataSourceIdList } = props

  try {
    const result = await removeDataSourceFromCollectionDbOp(
      dataSourceIdList,
      collectionId,
    )

    return result
  } catch (error) {
    console.log(2222, error)
    return { status: 404 }
  }
}

export async function getCollectionsForDataSourceList(dataSourceIdList: string[]) {
  try {
    const result = await getCollectionsForDataSourceListDbOp(dataSourceIdList)
    return result as string[]
  } catch (error) {
    console.log(2222, error)
    return [] as string[]
  }
}

export async function getWebsiteFromGCS(item: HistoryItem) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    return {
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    }
  }
  const { id: dataSourceId, type: DSType, name } = item

  // console.log(getWebsiteFromGCS())
  const GCS_PATH = buildGCSFilePath({ dataSourceId, DSType, name, userId })

  return 'https://storage.cloud.google.com/indie-chat-files/' + GCS_PATH

  // try {
  //   // const result = downloadWebsiteFromGCS(url)
  //   // return result
  // } catch (error) {
  //   console.log(2222, error)
  // }
}

export async function canRenderInIFrame(url: string) {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    throw new Error('Unauthorized')
  }

  try {
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

// https://storage.cloud.google.com/indie-chat-files/clq6rq97400011jm4hb81zu0a/websites/developer.chrome.com/docs-extensions-reference-api-pageCapture
