import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { HistoryLookup } from '@/components/history'
import { authOptions } from '@/lib/authOptions'
import { getDataSrcList } from '@/lib/db/dataSrc'

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
    title: 'History',
  }
}

export default async function ChatPage() {
  const session = (await getServerSession(authOptions)) as ExtSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/`)
  }

  const userId = session.user.id
  const historyItems = await getDataSrcList(userId)

  // return <div>Chat Page</div>
  return (
    <>
      <HistoryLookup userId={userId} historyItems={historyItems} />
    </>
  )
}
