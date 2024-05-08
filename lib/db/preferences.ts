'use server'

import { prisma } from '@/lib/db/connection'

export const getUserPreferencesDbOp = async (userId: string) => {
  const userPreferences = await prisma.userPreferences.findUnique({
    where: {
      userId,
    },
  })

  return userPreferences || undefined
}

export const updateUserPreferencesDbOp = async (userId: string, payload: any) => {
  // Retrieve existing preferences (if any)
  const existingPrefs = await prisma.userPreferences.findUnique({
    where: { userId },
    select: { tablePrefs: true },
  })

  const existingTablePrefs =
    typeof existingPrefs?.tablePrefs === 'object' ? existingPrefs.tablePrefs : {}

  const mergedPrefs = {
    ...existingTablePrefs,
    ...payload,
  }

  const userPreferences = await prisma.userPreferences.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      tablePrefs: mergedPrefs,
    },
    update: {
      tablePrefs: mergedPrefs,
    },
  })

  return userPreferences
}
