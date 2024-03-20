import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { authOptions } from '@/lib/authOptions'
import { ImportDataSource } from '@/components/import/importDataSource'

export async function generateMetadata(): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Import',
  }
}

export default async function ChatPage() {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/`)
  }
  const userId = session.user.id

  return <ImportDataSource userId={userId} />
}
