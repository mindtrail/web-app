'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'
import LoadingDots from '@/components/loading-dots'

export function Header() {
  const { data: session } = useSession()

  const user = session?.user

  return (
    <header
      className='sticky top-0 z-50 flex h-16 w-full shrink-0
      items-center justify-center bg-gradient-to-b border-b
      from-background/10 via-background/50 to-background/80 backdrop-blur-xl'
    >
      <div className='flex w-full max-w-6xl px-4 md:px-6 items-center justify-between'>
        <div className='flex w-40'>
          <Link href='/'>Indie Chat</Link>
        </div>
        {user && <Link href='/chat'>Dashboard</Link>}
        {/* <div className='hidden gap-2 items-center sm:flex'>
          <Link className='hover:bg-slate-50 px-2 py-1 rounded-md' href='#demo'>
            Demo
          </Link>
          <Link className='hover:bg-slate-50 px-2 py-1 rounded-md' href='#features'>
            Features
          </Link>
          <Link className='hover:bg-slate-50 px-2 py-1 rounded-md' href='#pricing'>
            Pricing
          </Link>
        </div> */}
        <div className='flex justify-end items-center w-40 relative'>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <LoginButton text='Sign In' className='-ml-2 select-none' />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
