'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import {
  createCollectionDbOp,
  deleteCollectionDbOp,
  getCollectionListDbOp,
  updateCollectionDbOp,
} from '../db/collection'

export async function getCollectionsByUserId() {
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
    const items = await getCollectionListDbOp({ userId })

    // Check if items is an array before mapping over it
    if (Array.isArray(items)) {
      const elements = items.map((item) => {
        return {
          id: item.id,
          name: item.name,
          description: item.description,
        }
      })
      return elements
    } else {
      // Handle the case where items is not an array
      return { error: { status: 500, message: 'Server error' } }
    }
  } catch (error) {
    return { status: 404 }
  }
}
export async function updateCollection({ collectionId, name }: CollectionItem) {
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
    return await updateCollectionDbOp({ collectionId, userId, name })
  } catch (error) {
    return { status: 404 }
  }
}

export async function deleteCollection({ collectionId }: { collectionId: string }) {
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
    await deleteCollectionDbOp(userId, collectionId)
  } catch (error) {
    return { status: 404 }
  }
}

export async function createCollection({ name }: CreateCollection) {
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
    return await createCollectionDbOp({ userId, name, description: '' })
  } catch (error) {
    return { status: 404 }
  }
}
