import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/types/types'
import { getDataStoreById } from '@/lib/db/dataStore'

import { Header } from '@/components/header'
import { CreateDataStore } from '@/components/datastore'

export interface EditDSProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditDSProps): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Chat',
  }
}

export default async function EditDS({ params }: EditDSProps) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/datastore/${params.id}`)
  }

  const userId = session?.user?.id
  const dataStoreId = params.id

  const dataStore = await getDataStoreById({ userId, dataStoreId })

  if (!dataStore) {
    redirect('/datastore?error=not-found')
  }

  return (
    <>
      {!dataStore ? (
        <div>Knowledge Base Not Found...</div>
      ) : (
        <>
          <Header session={session} />
          <CreateDataStore userId={userId} dataStore={dataStore} />
        </>
      )}
    </>
  )
}
