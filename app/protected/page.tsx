'use client'

import SignOut from '@/components/sign-out'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Home() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/protected')
    },
  })

  console.log(123, session)
  return (
    <div className='flex h-screen bg-black'>
      <div className='w-screen h-screen flex flex-col space-y-5 justify-center items-center'>
        <h2 className='text-white'>Protected Page</h2>
        <p className='text-white'>Welcome, {session?.user?.email}</p>
        <SignOut />
      </div>
    </div>
  )
}
