'use server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import {
  getTagsListDbOp,
  createTagDbOp,
  updateTagDbOp,
  deleteTagDbOp,
  addTagToDataSourcesDbOp,
} from '@/lib/db/tags'

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
    return await deleteTagDbOp({ tagId, userId })
  } catch (error) {
    return { status: 404 }
  }
}

type AddTagToDataSources = {
  id: string
  dataSourceIdList: string[]
}
export async function addTagToDataSources(props: AddTagToDataSources) {
  const { id: tagId, dataSourceIdList } = props

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
