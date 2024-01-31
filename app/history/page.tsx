import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { authOptions } from '@/lib/authOptions'
import { getDataSourceListForUser } from '@/lib/db/dataSource'
import { getUserPreferences } from '@/lib/db/preferences'

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
    title: 'Categories',
  }
}

export default async function ChatPage() {
  const session = (await getServerSession(authOptions)) as ExtSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/`)
  }

  const userId = session.user.id

  try {
    let [userPreferences, historyItems] = await Promise.all([
      getUserPreferences(userId),
      getDataSourceListForUser(userId),
    ])

    historyItems = historyItems.splice(0, 40)
    return (
      <HistoryComponent
        historyMetadata={{
          name: 'All items',
          parent: '',
          subParent: '',
          parentLink: '',
        }}
        userId={userId}
        historyItems={historyItems}
        userPreferences={userPreferences}
      />
    )
  } catch (err) {
    console.log(err)
    return null
  }
}
