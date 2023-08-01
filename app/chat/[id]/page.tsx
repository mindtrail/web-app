import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { authOptions } from 'lib/authOptions'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

// export const runtime = 'edge'
// export const preferredRegion = 'home'

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

  const userId = session.user.id

  const chat = await getChat(params.id, userId)
  return {
    title: chat?.title.slice(0, 50) ?? 'Chat',
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await getServerSession(authOptions)) as ExtSession
  console.log(session)

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/${params.id}`)
  }

  const userId = session.user.id
  const chat = await getChat(params.id, userId)

  if (!chat) {
    notFound()
  }

  if (chat?.userId !== userId) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
