import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { getDataStoreById } from '@/lib/db/dataStore'
import { authOptions } from '@/lib/authOptions'
import { Chat } from '@/components/chat'

const TEST_DATA_STORE = process.env.TEST_DATASTORE_ID || ''
const FLOWISE_URL = process.env.FLOWISE_URL || ''

export interface ChatPageProps {
  params: {
    id: string
  }
}

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
    title: 'Chat',
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await getServerSession(authOptions)) as ExtSession
  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/`)
  }
  const userId = session.user.id
  const chatId = TEST_DATA_STORE

  const dataStore = (await getDataStoreById({
    userId,
    dataStoreId: chatId,
  })) as DataStoreExtended

  if (!dataStore) {
    redirect(`/datastore?notFound=${chatId}`)
  }

  const { name, description } = dataStore

  return (
    <Chat
      id={chatId}
      userId={userId}
      name={name}
      description={description || ''}
      flowiseURLEnvVar={
        'http://ec2-18-195-176-166.eu-central-1.compute.amazonaws.com:3000/api/v1/prediction/dc41ff3b-210c-4f73-a4c6-4ea4e229f19e'
      }
    />
  )
}
