import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getCollectionDbOp } from '@/lib/db/collection'

import { CreateCollection } from '@/components/collection'

export interface EditDSProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params,
}: EditDSProps): Promise<Metadata> {
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

  const dataStore = await getCollectionDbOp({ userId, dataStoreId })

  if (!dataStore) {
    redirect('/datastore?error=not-found')
  }

  return (
    <>
      {!dataStore ? (
        <div>Knowledge Base Not Found...</div>
      ) : (
        <>
          <CreateCollection userId={userId} dataStore={dataStore} />
        </>
      )}
    </>
  )
}
