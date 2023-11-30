import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { authOptions } from '@/lib/authOptions'
import { getDataSrcList } from '@/lib/db/dataSrc'
import { getVectorItemsByDataSrcId } from '@/lib/qdrant'

import { HistoryView } from '@/components/history'

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

  let historyItems = (await getDataSrcList(userId)).slice(0, 10)
  const historyItemsIds = historyItems.map((item) => item.id)
  const metadata = null //await getVectorItemsByDataSrcId(historyItemsIds)

  if (metadata) {
    historyItems = historyItems.map((item) => {
      // @ts-ignore
      const itemMetadata = metadata[item.id]

      return {
        ...item, //@ts-ignore
        ...metadata[item.id],
      }
    })
  }

  return <HistoryView userId={userId} historyItems={historyItems} />
}
