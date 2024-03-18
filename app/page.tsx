import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/protected`)
  }

  return (
    <div className='flex flex-col flex-1 w-full items-center bg-muted/50'>
      <div className='flex flex-col flex-1 w-full max-w-6xl'>
        <div className='flex flex-col flex-1 w-full items-center sm:px-6 cursor-default'>
          <section className='flex w-full justify-center'>{/* <ChatDemo /> */}</section>
        </div>
      </div>
    </div>
  )
}
