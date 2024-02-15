import { type Metadata } from 'next'
import { redirect, useServerInsertedHTML } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getTagWithDataSourcesDbOp } from '@/lib/db/tags'

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

  const currentTag = await getTagWithDataSourcesDbOp({ userId, tagId })
  return {
    title: `#${currentTag?.name}`,
    description: `Tag page: ${currentTag?.name}`,
  }
}

export default async function FolderItem({ params }: FolderItemProps) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  const userId = session?.user?.id
  if (!userId) {
    redirect(`/api/auth/signin?callbackUrl=/tag/${params.id}`)
  }

  const tagId = params.id
  const currentTag = await getTagWithDataSourcesDbOp({ userId, tagId })

  if (!currentTag) {
    return <div>Tag Not Found...</div>
  }

  const userPreferences = await getUserPreferencesDbOp(userId)
  const historyItems = currentTag.dataSources

  return (
    <HistoryComponent
      historyItems={historyItems}
      userId={userId}
      userPreferences={userPreferences}
    />
  )
}
