import * as React from 'react'
import Link from 'next/link'
// import { useSession } from 'next-auth/react'

import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'

import { ExtendedSession } from '@/lib/types'

interface HeaderProps {
  session: ExtendedSession
}

export function Header({ session }: HeaderProps) {
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
        {user && <Link href='/dashboard'>Dashboard</Link>}

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
