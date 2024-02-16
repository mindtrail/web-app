'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

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
      body: JSON.stringify({ urls, collectionId, userId, limit: 2 }),
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
  dataSourceIdList: string[]
  collectionId: string
}

export async function removeDataSourceFromCollection({
  collectionId,
  dataSourceIdList,
}: RemoveDSFromCollection) {
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
