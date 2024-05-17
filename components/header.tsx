import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'

import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'

export async function Header() {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const user = session?.user

  return (
    <header
      className='sticky top-0 z-50 flex h-16 w-full shrink-0
      items-center justify-center bg-gradient-to-b border-b
      from-background/10 via-background/50 to-background/80 backdrop-blur-xl sm:px-6 px-12'
    >
      <div className='flex w-full px-4 md:px-0 items-center justify-between'>
        <Link href='/' className='flex w-40 items-center gap-4'>
          <Image width={32} height={32} src='/icon-2.png' alt='EZ RPA' />
          EZ RPA
        </Link>

        {/* {user && <Link href='/folder'>Knowledge Bases</Link>} */}

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
