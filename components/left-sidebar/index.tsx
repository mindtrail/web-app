'use client'

import Link from 'next/link'
import Image from 'next/image'

import { useGlobalState, useGlobalStateActions } from '@/context/global-state'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'

import { LeftSidebarFooter } from '@/components/left-sidebar/footer'
import { FoldersList } from '@/components/left-sidebar/nested-list'
import { NavListTop } from '@/components/left-sidebar/nav-list-top'
import { APP_NAME } from '@/components/left-sidebar/constants'

type SidebarNavProps = {
  className?: string
  user: any
}

export async function LeftSidebar({ user }: SidebarNavProps) {
  const [state] = useGlobalState()

  const { activeNestedSidebar, nestedItemsByCategory } = state
  const { setActiveNestedSidebar, setNestedItemsByCategory } = useGlobalStateActions()

  return (
    <div className='min-h-screen flex flex-col select-none'>
      <nav
        className='flex flex-col flex-1 justify-between w-[256px] flex-shrink-0
          border-r overflow-hidden transition-all duration-300 ease-in-out h-screen'
      >
        <div className='h-14 border-b flex items-center justify-center'>
          <Link href='/' className='flex gap-4 w-full px-4 py-2 self-center items-center'>
            <Image width={30} height={30} src='/icon-2.png' alt='Mind Trail' />
            {APP_NAME}
          </Link>
        </div>

        <div className='flex-1 flex flex-col space-between pb-2 relative'>
          <NavListTop setActiveNestedSidebar={setActiveNestedSidebar} />
          <Separator />
          <FoldersList
            activeNestedSidebar={activeNestedSidebar}
            nestedItemsByCategory={nestedItemsByCategory}
            setActiveNestedSidebar={setActiveNestedSidebar}
            setNestedItemsByCategory={setNestedItemsByCategory}
          />

          <ThemeToggle className='ml-2 ' />
        </div>
        <LeftSidebarFooter user={user} />
      </nav>
    </div>
  )
}
