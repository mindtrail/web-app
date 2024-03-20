import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { authOptions } from '@/lib/authOptions'
import { getDataSourceListDbOp } from '@/lib/db/dataSource'
import { getUserPreferencesDbOp } from '@/lib/db/preferences'
// import { getClippingList } from '@/lib/db/clipping'

import { HistoryComponent } from '@/components/history'

export async function generateMetadata(): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Highlights',
    description: 'Highlights made by users',
  } // bordeianu, rednic, toader
}

export default async function ChatPage() {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    redirect(`/api/auth/signin?callbackUrl=/highlights/`)
  }

  let userPreferences, historyItems

  try {
    ;[userPreferences, historyItems] = await Promise.all([
      getUserPreferencesDbOp(userId),
      getDataSourceListDbOp({ userId, hasClippings: true }),
    ])
  } catch (err) {
    console.error(err)
    return <div>Error loading history.</div>
  }

  historyItems = historyItems.map(({ clippings, ...rest }) => ({
    subRows: clippings,
    ...rest,
  }))

  return (
    <HistoryComponent
      historyItems={historyItems}
      userId={userId}
      userPreferences={userPreferences}
    />
  )
}
