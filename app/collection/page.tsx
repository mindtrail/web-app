import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getCollectionListDbOp } from '@/lib/db/collection'

import { CollectionList } from '@/components/collection'

export async function generateMetadata(): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Chat',
  }
}

export interface DSProps {
  searchParams: {
    notFound?: string
    refresh?: string
  }
}

export default async function CollectionPage(params: DSProps) {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    redirect(`/api/auth/signin?callbackUrl=/collection`)
  }

  // @TODO: send a notification to the user that the chat was not found
  const notFoundChat = params?.searchParams?.notFound
  const refresh = params?.searchParams?.refresh

  const userId = session?.user?.id
  const collectionList = await getCollectionListDbOp({
    userId,
    includeDataSource: true,
  })

  console.log(collectionList)

  if (!collectionList?.length) {
    redirect(`/collection/create`)
  }

  return <CollectionList collectionList={collectionList} />
}
