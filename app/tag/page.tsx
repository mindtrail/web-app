import { type Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { getTagsListDbOp } from '@/lib/db/tags'

export async function generateMetadata(): Promise<Metadata> {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  if (!session?.user?.id) {
    return {}
  }

  return {
    title: 'Tags',
    description: 'AI generated tags for your knowledge base',
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
  const userId = session?.user?.id

  if (!userId) {
    redirect(`/api/auth/signin?callbackUrl=/collection`)
  }

  // @TODO: send a notification to the user that the chat was not found
  const notFoundChat = params?.searchParams?.notFound
  const refresh = params?.searchParams?.refresh

  const tagsList = await getTagsListDbOp()

  if (!tagsList?.length) {
    return <div>No tags found</div>
  }

  return (
    <div className='flex flex-col gap-2'>
      {tagsList.map((tag, index) => (
        <span key={index}>{tag.name}</span>
      ))}
    </div>
  )
  // return <CollectionList collectionList={collectionList} />
}
