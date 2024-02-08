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

  const userId = session?.user?.id
  if (!userId) {
    redirect(`/api/auth/signin?callbackUrl=/chat/`)
  }

  let userPreferences, historyItems

  try {
    ;[userPreferences, historyItems] = await Promise.all([
      getUserPreferences(userId),
      getDataSourceListForUser(userId),
    ])
  } catch (err) {
    console.log(err)
    return <div>Error loading history.</div>
  }

  historyItems = historyItems.splice(0, 40)
  const historyMetadata = {
    name: 'All items',
    parent: '',
    subParent: '',
    parentLink: '',
  }

  return <div>Highlights</div>
}
