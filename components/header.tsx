import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
// import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { buttonVariants } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar/sidebar'
import { SidebarList } from '@/components/sidebar/sidebar-list'
import { SidebarFooter } from '@/components/sidebar/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { IconSeparator } from '@/components/ui/icons'
import { ClearHistory } from '@/components/sidebar/clear-history'
import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'

export async function Header() {
  // const session = await auth()
  // @TODO:
  const session = { user: null }

  return (
    <header className='sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl'>
      <div className='flex items-center'>
        <Sidebar>
          <React.Suspense fallback={<div className='flex-1 overflow-auto' />}>
            {/* @ts-ignore */}
            <SidebarList userId={'123'} />
          </React.Suspense>
          <SidebarFooter>
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>
        <div className='flex items-center'>{/* <UserMenu /> */}</div>
      </div>
      <div className='flex items-center justify-end space-x-2'>
        <LoginButton variant='link' showGithubIcon={false} text='Login' className='-ml-2' />
      </div>
    </header>
  )
}
