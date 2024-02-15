import { type Metadata } from 'next'
import { redirect, useServerInsertedHTML } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'

import { getCollectionDbOp } from '@/lib/db/collection'
import { getDataSourceListDbOp } from '@/lib/db/dataSource'

import { getUserPreferencesDbOp } from '@/lib/db/preferences'
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
  if (!userId || !collectionId) {
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
  let userPreferences, historyItems

  try {
    ;[userPreferences, historyItems] = await Promise.all([
      getUserPreferencesDbOp(userId),
      getDataSourceListDbOp({ userId, collectionId }),
    ])
  } catch (err) {
    console.error(err, userPreferences, historyItems)
    return <div>Error loading items for the collection.</div>
  }

  return (
    <HistoryComponent
      historyItems={historyItems}
      userId={userId}
      userPreferences={userPreferences}
    />
  )
}
