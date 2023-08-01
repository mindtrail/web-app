import Link from 'next/link'

import { getNanoId } from '@/lib/utils'
import { Chat } from '@/components/chat'

export default function Home() {
  const id = getNanoId()
  return (
    <div className='flex h-screen'>
      <div className='w-screen h-screen flex flex-col justify-center items-center'>
        <div className='flex-col space-x-3'>
          <Chat id={id} />

          <h2>Homescreen</h2>
          <br />
          <Link
            href='/protected'
            prefetch={false} // workaround until https://github.com/vercel/vercel/pull/8978 is deployed
            className='text-stone-400 underline hover:text-stone-200 transition-all'
          >
            Protected Page
          </Link>
        </div>
      </div>
    </div>
  )
}
