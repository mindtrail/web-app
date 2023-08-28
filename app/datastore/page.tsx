import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getDataStoreListDbOp } from '@/lib/db/dataStore'

import { Header } from '@/components/header'
import { DataStoreList } from '@/components/datastore'

export async function generateMetadata(): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Chat',
  }
}

export default async function DataStorePage() {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/datastore`)
  }

  const userId = session?.user?.id
  const dataStoreList = await getDataStoreListDbOp({ userId, includeDataSrc: true })

  if (!dataStoreList?.length) {
    redirect(`/datastore/create`)
  }

  return (
    <>
      <Header session={session} />
      <DataStoreList dataStoreList={dataStoreList} />
    </>
  )
}
