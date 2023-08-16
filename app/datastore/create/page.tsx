import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/types/types'

import { Header } from '@/components/header'
import { CreateDataStore } from '@/components/datastore'

export async function generateMetadata(): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Chat',
  }
}

export default async function CreateDS() {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/datastore/create`)
  }

  const userId = session?.user?.id

  return (
    <>
      <Header session={session} />
      <CreateDataStore userId={userId} />
    </>
  )
}
