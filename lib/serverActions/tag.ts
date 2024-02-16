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

async function checkAuth() {
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
  return { userId }
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
  const auth = await checkAuth()
  if (auth.error) {
    return auth
  }
  const { userId } = auth

  try {
    return await updateTagDbOp({ tagId, userId, name })
  } catch (error) {
    return { status: 404 }
  }
}

export async function createTag({ name }: { name: string }) {
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
    return await createTagDbOp({ name })
  } catch (error) {
    return { status: 404 }
  }
}

type TagPayload = {
  tagId: string
}

export async function deleteTag({ tagId }: TagPayload) {
  const auth = await checkAuth()
  if (auth.error) {
    return auth
  }
  const { userId } = auth

  try {
    return await deleteTagDbOp({ tagId, userId })
  } catch (error) {
    return { status: 404 }
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
