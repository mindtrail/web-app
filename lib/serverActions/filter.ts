'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import {
  createFilterDbOp,
  deleteFilterDbOp,
  updateFilterDbOp,
} from '../db/filter'

export async function getFiltersByUserId() {
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
    const items = await { userId: userId }

    // Check if items is an array before mapping over it
    if (Array.isArray(items)) {
      const elements = items.map((item) => {
        return {
          id: item.id,
          name: item.name,
          criteria: item.criteria,
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
export async function updateFilter({ filterId, name }: UpdateFilter) {
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
    await updateFilterDbOp({ filterId, userId, name })
  } catch (error) {
    return { status: 404 }
  }
}

export async function deleteFilter({ filterId }: FilterItem) {
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
    await deleteFilterDbOp(userId, filterId)
  } catch (error) {
    return { status: 404 }
  }
}

export async function createFilter({ name }: CreateFilter) {
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
    return await createFilterDbOp({ userId, name })
  } catch (error) {
    return { status: 404 }
  }
}
