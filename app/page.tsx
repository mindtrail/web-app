import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'
import { ExtendedSession } from '@/lib/types'

import { Header } from '@/components/header'
import { ChatDemo } from '@/components/chat/chat-demo'

export default async function Home() {
  const session = (await getServerSession(authOptions)) as ExtendedSession

  return (
    <div className='flex flex-col flex-1 w-full items-center bg-muted/50'>
      <Header session={session} />
      <div className='flex flex-col flex-1 w-full max-w-6xl'>
        <div className='flex flex-col flex-1 w-full items-center sm:px-6 cursor-default'>
          <section className='flex flex-col w-full py-24 gap-2 items-center'>
            <h1 className='text-xl'>Indie Chat</h1>
            <h2 className='text-lg text-gray-500'>
              An AI-Powered chatbot for your docs and website.
            </h2>
          </section>
          <section className='flex w-full justify-center'>
            <ChatDemo />
          </section>
        </div>
      </div>
    </div>
  )
}
