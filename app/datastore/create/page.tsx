import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/lib/types'

import { Header } from '@/components/header'
import { CreateDataStore } from '@/components/datastore'

export interface CreateDSProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CreateDSProps): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Chat',
  }
}

export default async function CreateDS({ params }: CreateDSProps) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/${params.id}`)
  }

  const userId = session?.user?.id

  return (
    <>
      <Header session={session} />
      <CreateDataStore userId={userId} />
    </>
  )
}
