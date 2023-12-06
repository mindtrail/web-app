import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { Session } from 'next-auth'

import { authOptions } from '@/lib/authOptions'
import { getCollectionDbOp } from '@/lib/db/collection'
import { ImportDataSrc } from '@/components/datastore/import/importDataSrc'

const TEST_DATA_STORE = process.env.TEST_DATASTORE_ID || ''

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
    title: 'Import',
  }
}

export default async function ChatPage() {
  const session = (await getServerSession(authOptions)) as ExtSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/chat/`)
  }
  const userId = session.user.id

  const dataStore = await getCollectionDbOp({
    userId,
    dataStoreId: TEST_DATA_STORE,
  })

  if (!dataStore) {
    redirect('/datastore?error=not-found')
  }

  return <ImportDataSrc userId={userId} dataStore={dataStore} />
}
