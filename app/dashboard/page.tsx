import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/lib/types'
import { getDataStoreList } from '@/lib/dataStore'

import { Header } from '@/components/header'
import { CreateDataStore, ListDataStores } from '@/components/datastore'

export interface DashboardProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DashboardProps): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Chat',
  }
}

export default async function Dashboard({ params }: DashboardProps) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/${params.id}`)
  }

  const userId = session?.user?.id
  let datastoreList = await getDataStoreList(userId)

  return (
    <>
      <Header session={session} />
      {!datastoreList?.length ? (
        <CreateDataStore userId={userId} />
      ) : (
        <ListDataStores datastoreList={datastoreList} />
      )}
    </>
  )
}
