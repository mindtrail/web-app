import { type Metadata } from 'next'
import { redirect, useServerInsertedHTML } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getTagDbOp } from '@/lib/db/tags'
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
  const tagId = params.id

  if (!userId || !tagId) {
    return {}
  }

  const currentTag = await getTagDbOp({ userId, tagId })

  return {
    title: `#${currentTag?.name}`,
    description: `Tags page: ${currentTag?.name}`,
  }
}

export default async function FolderItem({ params }: FolderItemProps) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    redirect(`/api/auth/signin?callbackUrl=/tag/${params.id}`)
  }

  const tagId = params.id
  let userPreferences, historyItems

  try {
    ;[userPreferences, historyItems] = await Promise.all([
      getUserPreferencesDbOp(userId),
      getDataSourceListDbOp({ userId, tagId }),
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
