import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { getDataStoreById } from '@/lib/db/dataStore'
import { Header } from '@/components/header'
import { authOptions } from '@/lib/authOptions'
import { Chat } from '@/components/chat'
// import { getChat } from '@/app/actions'

export interface ChatPageProps {
  params: {
    id: string
  }
}

interface UserWithId {
  id: string | null
}
type ExtSession = Session & { user: UserWithId | null }

export async function generateMetadata({ params }: ChatPageProps): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtSession

  if (!session?.user?.id) {
    return {}
  }

  // const userId = session.user.id
  // const chat = await getChat(params.id, userId)
  return {
    title: 'Chat',
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await getServerSession(authOptions)) as ExtSession
  const chatId = params.id
  const userId = session.user.id

  const flowiseURL = process.env.FLOWISE_URL

  if (!userId) {
    redirect(`/api/auth/signin?callbackUrl=/chat/${chatId}`)
  }

  const dataStore = (await getDataStoreById({ userId, dataStoreId: chatId })) as DataStoreExtended
  const { name, description } = dataStore

  // const chat = await getChat(chatId, userId)
  // if (!chat || chat?.userId !== userId) {
  // notFound()
  // }

  return (
    <>
      <Header session={session} />
      <Chat
        id={chatId}
        userId={userId}
        name={name}
        description={description || ''}
        flowiseURLEnvVar={flowiseURL}
      />
    </>
  )
}
