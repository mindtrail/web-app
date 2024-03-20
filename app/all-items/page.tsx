import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getDataSourceListDbOp } from '@/lib/db/dataSource'
import { getUserPreferencesDbOp } from '@/lib/db/preferences'

import { HistoryComponent } from '@/components/history'

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

  let userPreferences, historyItems

  try {
    ;[userPreferences, historyItems] = await Promise.all([
      getUserPreferencesDbOp(userId),
      getDataSourceListDbOp({ userId }),
    ])
  } catch (err) {
    console.error(err)
    return <div>Error loading history.</div>
  }

  return (
    <HistoryComponent
      historyItems={historyItems}
      userId={userId}
      userPreferences={userPreferences}
    />
  )
}
