'use client'

import Link from 'next/link'
import Image from 'next/image'

import { useGlobalState, useGlobalStateActions } from '@/context/global-state'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'

import { LeftSidebarFooter } from '@/components/left-sidebar/footer'
import { FoldersList } from '@/components/left-sidebar/nested-list'
import { NavItemList } from '@/components/left-sidebar/nav-item-list'
import {
  APP_NAME,
  TOP_SIDEBAR_ITEMS,
  OTHER_SIDEBAR_ITEMS,
} from '@/components/left-sidebar/constants'

type SidebarNavProps = {
  className?: string
  user: any
}

export function LeftSidebar({ user }: SidebarNavProps) {
  const [state] = useGlobalState()

  const { activeNestedSidebar, nestedItemsByCategory } = state
  const { setActiveNestedSidebar, setNestedItemsByCategory } = useGlobalStateActions()

  return (
    <div className='min-h-screen flex flex-col select-none bg-background'>
      <nav
        className='flex flex-col flex-1 justify-between w-[256px] flex-shrink-0
          border-r overflow-hidden transition-all duration-300 ease-in-out h-screen'
      >
        <div className='h-14 border-b flex items-center justify-center'>
          <Link href='/' className='flex gap-4 w-full px-4 py-2 self-center items-center'>
            <Image width={30} height={30} src='/icon-2.png' alt='EZ RPA' />
            {APP_NAME}
          </Link>
        </div>

        <div className='flex-1 flex flex-col pb-2 relative'>
          <NavItemList
            setActiveNestedSidebar={setActiveNestedSidebar}
            list={TOP_SIDEBAR_ITEMS}
          />
          <FoldersList
            activeNestedSidebar={activeNestedSidebar}
            nestedItemsByCategory={nestedItemsByCategory}
            setActiveNestedSidebar={setActiveNestedSidebar}
            setNestedItemsByCategory={setNestedItemsByCategory}
          />
          <Separator />

          <NavItemList
            setActiveNestedSidebar={setActiveNestedSidebar}
            list={OTHER_SIDEBAR_ITEMS}
          />

          <ThemeToggle className='ml-2 absolute bottom-2' />
        </div>
        <LeftSidebarFooter user={user} />
      </nav>
    </div>
  )
}
