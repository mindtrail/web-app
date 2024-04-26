import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getUserPreferencesDbOp } from '@/lib/db/preferences'
import { FlowWithProvider } from '@/components/flow'

export async function generateMetadata(): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'All Items',
    description: 'All items in your history',
  }
}

export default async function AllItems() {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    redirect(`/api/auth/signin?callbackUrl=/all-items/`)
  }

  let userPreferences

  try {
    ;[userPreferences] = await Promise.all([getUserPreferencesDbOp(userId)])
  } catch (err) {
    console.error(err)
    return <div>Error loading history.</div>
  }

  return <FlowWithProvider />
}
