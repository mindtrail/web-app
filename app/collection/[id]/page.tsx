import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getCollectionDbOp } from '@/lib/db/collection'

import { getUserPreferences } from '@/lib/db/preferences'
import { HistoryComponent } from '@/components/history'

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

  const userId = session?.user?.id
  if (!userId) {
    redirect(`/api/auth/signin?callbackUrl=/collection/${params.id}`)
  }

  const collectionId = params.id
  const collection = await getCollectionDbOp({ userId, collectionId })

  if (!collection) {
    return <div>Knowledge Base Not Found...</div>
  }

  let userPreferences = await getUserPreferences(userId)

  const historyMetadata = {
    name: collection.name,
    parent: 'All items',
    subParent: 'Folders',
    parentLink: '/history',
  }

  return (
    <HistoryComponent
      historyMetadata={historyMetadata}
      userId={userId}
      historyItems={collection.dataSources}
      userPreferences={userPreferences}
    />
  )
}
