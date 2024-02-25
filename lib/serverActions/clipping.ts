'use server'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { deleteClippingDbOp } from '@/lib/db/clipping'

export async function deleteClipping({ clippingId }: { clippingId: string }) {
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
    await deleteClippingDbOp(userId, clippingId)
  } catch (error) {
    return { status: 404 }
  }
}
