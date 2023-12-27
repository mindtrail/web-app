import { UserPreferences } from '@prisma/client'
import prisma from '@/lib/db/connection'

export const getUserPreferences = async (userId: string) => {
  const userPreferences = await prisma.userPreferences.findUnique({
    where: {
      userId,
    },
  })

  return userPreferences || undefined
}

export const updateUserPreferences = async (
  userId: string,
  data: UserPreferences,
) => {
  const userPreferences = await prisma.userPreferences.upsert({
    where: {
      userId,
    },
    // @ts-ignore
    update: {
      ...data,
    },
  })

  return userPreferences
}
