import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getServerSession } from 'next-auth/next'

import { authOptions } from '@/lib/authOptions'

import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'

export async function SidebarRight() {
  const session = (await getServerSession(authOptions)) as ExtendedSession
  const user = session?.user

  return (
    <div className='flex flex-col w-[250px]'>
      <div className='flex relative h-12 items-center'>
        {user ? (
          <UserMenu user={user} />
        ) : (
          <>
            <LoginButton text='Sign In' className='-ml-2 select-none' />
          </>
        )}
      </div>
      <div className='flex mt-20 flex-1 flex-col items-center justify-center  border-t  border-l'>
        Chat Section
      </div>
    </div>
  )
}
