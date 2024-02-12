import { type Metadata } from 'next'
import { redirect, useServerInsertedHTML } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getCollectionDbOp } from '@/lib/db/collection'

import { getUserPreferences } from '@/lib/db/preferences'
import { HistoryComponent } from '@/components/history'

export interface FolderItemProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: FolderItemProps): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  const collectionId = params.id
  if (!userId) {
    return {}
  }

  const collection = await getCollectionDbOp({ userId, collectionId })

  return {
    title: collection?.name,
    description: collection?.description,
  }
}

export default async function FolderItem({ params }: FolderItemProps) {
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

  const userPreferences = await getUserPreferences(userId)
  const historyItems = collection.dataSources

  return (
    <HistoryComponent
      historyItems={historyItems}
      userId={userId}
      userPreferences={userPreferences}
    />
  )
}
