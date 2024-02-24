import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { authOptions } from '@/lib/authOptions'
import { getDataSourceListDbOp } from '@/lib/db/dataSource'
import { getUserPreferencesDbOp } from '@/lib/db/preferences'
// import { getClippingList } from '@/lib/db/clipping'

import { HistoryComponent } from '@/components/history'

interface UserWithId {
  id: string | null
}
type ExtSession = Session & { user: UserWithId | null }

export async function generateMetadata(): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Highlights',
    description: 'Highlights made by users',
  } // bordeianu, rednic, toader
}

export default async function ChatPage() {
  const session = (await getServerSession(authOptions)) as ExtSession

  const userId = session?.user?.id
  if (!userId) {
    redirect(`/api/auth/signin?callbackUrl=/highlights/`)
  }

  let userPreferences, historyItems

  try {
    ;[userPreferences, historyItems] = await Promise.all([
      getUserPreferencesDbOp(userId),
      getDataSourceListDbOp({ userId, containClippings: true }),
    ])
  } catch (err) {
    console.log(err)
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
