import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { authOptions } from 'lib/authOptions'
import { Chat } from '@/components/chat'

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

  return {
    title: 'Chat',
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await getServerSession(authOptions)) as ExtSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/${params.id}`)
  }

  const userId = session.user.id

  // return <div>Chat Page</div>
  return <Chat id={'123'} initialMessages={[]} />
}
