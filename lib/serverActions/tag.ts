'use server'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getTagsListDbOp, updateTagDbOp, deleteTagDbOp } from '@/lib/db/tags'

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
