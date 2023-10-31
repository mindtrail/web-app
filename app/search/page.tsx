import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { searchHistory } from '@/lib/search'
import { Search } from '@/components/search'
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
    title: 'Search',
  }
}

export default async function ChatPage() {
  async function submitSearch(searchQuery: string) {
    'use server'
    const result = await searchHistory(searchQuery)
    console.log(1111, searchQuery)
    const response = await result.json()
    console.log(2222, response)
    // return result
  }

  const session = (await getServerSession(authOptions)) as ExtSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/`)
  }

  const userId = session.user.id
  const historyItems = await getDataSrcList(userId)
  console.log(222)
  // return <div>Chat Page</div>
  return (
    <>
      <Search foundWebsite={historyItems} submitSearch={submitSearch} />
    </>
  )
}
