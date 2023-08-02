import * as React from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'

import { authOptions } from 'lib/authOptions'
import { cn } from '@/lib/utils'

import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'

export async function Header() {
  const session = await getServerSession(authOptions)

  const user = session?.user
  console.log(user)

  return (
    <header
      className='sticky top-0 z-50 flex h-16 w-full shrink-0
      items-center justify-center bg-gradient-to-b border-b
      from-background/10 via-background/50 to-background/80 backdrop-blur-xl'
    >
      <div className='flex w-full max-w-6xl px-6 items-center justify-between'>
        <Link href='/'>Indie Chat</Link>
        <div className='flex gap-2 items-center'>
          <Link className='hover:bg-slate-50 px-2 py-1 rounded-md' href='#demo'>
            Demo
          </Link>
          <Link className='hover:bg-slate-50 px-2 py-1 rounded-md' href='#features'>
            Features
          </Link>
          <Link className='hover:bg-slate-50 px-2 py-1 rounded-md' href='#pricing'>
            Pricing
          </Link>
        </div>
        <div className='flex space-x-2'>
          {user ? <UserMenu user={user} /> : <LoginButton text='Sign In' className='-ml-2' />}
        </div>
      </div>
    </header>
  )
}
