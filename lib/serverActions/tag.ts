'use server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import {
  getTagsListDbOp,
  createTagDbOp,
  updateTagDbOp,
  deleteTagDbOp,
  addTagToDataSourcesDbOp,
  removeTagFromDataSourcesDbOp,
  getTagsForDataSourcesListDbOp,
} from '@/lib/db/tags'

async function checkAuthUser() {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const userId = session?.user?.id

  if (!userId) {
    throw new Error('Unauthorized')
  }

  return userId
}

function genericErrorHandler(error: any) {
  if (error.message === 'Unauthorized') {
    return {
      error: {
        status: 401,
        message: 'Unauthorized',
      },
    }
  }

  return { status: 404 }
}

export const getTagsList = () => {
  try {
    return getTagsListDbOp()
  } catch (error) {
    console.error(error)
    return {
      error: { message: 'Something went wrong' },
    }
  }
}

type UpdateTag = {
  tagId: string
  name: string
}

export async function updateTag({ tagId, name }: UpdateTag) {
  try {
    const userId = await checkAuthUser()

    return await updateTagDbOp({ tagId, userId, name })
  } catch (error) {
    return genericErrorHandler(error)
  }
}

export async function createTag({ name }: { name: string }) {
  try {
    checkAuthUser()

    return await createTagDbOp({ name })
  } catch (error) {
    return genericErrorHandler(error)
  }
}

type TagPayload = {
  tagId: string
}

export async function deleteTag({ tagId }: TagPayload) {
  try {
    const userId = await checkAuthUser()

    return await deleteTagDbOp({ tagId, userId })
  } catch (error: any) {
    return genericErrorHandler(error)
  }
}

type UpdateDSTagConnection = {
  id: string
  dataSourceIdList: string[]
}

export async function addTagToDataSources(props: UpdateDSTagConnection) {
  const { id: tagId, dataSourceIdList } = props

  const auth = await checkAuth()
  if (auth.error) {
    return auth
  }

  if (!dataSourceIdList?.length || !tagId) {
    return {
      error: {
        status: 400,
        message: 'Invalid request, No DataSources or Tags provided',
      },
    }
  }

  try {
    return await addTagToDataSourcesDbOp({ dataSourceIdList, tagId })
  } catch (e) {
    console.log('Error ---', e)
    const result = {
      error: {
        status: 500,
        message: 'Error setting Tag to DataSources',
      },
    }

    console.log(result)
    return result
  }
}

export async function removeTagFromDataSources(props: UpdateDSTagConnection) {
  const { id: tagId, dataSourceIdList } = props

  console.log(dataSourceIdList, tagId)
  const auth = await checkAuth()
  if (auth.error) {
    return auth
  }

  if (!dataSourceIdList?.length || !tagId) {
    return {
      error: {
        status: 400,
        message: 'Invalid request, No DataSources or Tags provided',
      },
    }
  }

  try {
    return await removeTagFromDataSourcesDbOp({ dataSourceIdList, tagId })
  } catch (e) {
    console.log('Error ---', e)
    const result = {
      error: {
        status: 500,
        message: 'Error setting Tag to DataSources',
      },
    }

    console.log(result)
    return result
  }
}

export async function getTagsForDataSourcesList(dataSourceIdList: string[]) {
  try {
    const result = await getTagsForDataSourcesListDbOp(dataSourceIdList)
    return result as string[]
  } catch (error) {
    console.log(2222, error)
    return [] as string[]
  }
}
