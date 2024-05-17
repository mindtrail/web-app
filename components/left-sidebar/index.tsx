'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UploadIcon } from 'lucide-react'

import { useGlobalState, useGlobalStateActions } from '@/context/global-state'
import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'

import { LeftSidebarFooter } from '@/components/left-sidebar/footer'
import { FoldersList } from '@/components/left-sidebar/folders-list'
import { NavItemList } from '@/components/left-sidebar/nav-item-list'
import {
  APP_NAME,
  TOP_SIDEBAR_ITEMS,
  OTHER_SIDEBAR_ITEMS,
} from '@/components/left-sidebar/constants'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const SIDEBAR_BTN = cn(buttonVariants({ variant: 'sidebar' }))
const ACTIVE_BTN = cn(buttonVariants({ variant: 'sidebarActive' }))

type SidebarNavProps = {
  className?: string
  user: any
}

export function LeftSidebar({ user }: SidebarNavProps) {
  const [state] = useGlobalState()
  const pathname = usePathname()

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
            list={TOP_SIDEBAR_ITEMS}
            pathname={pathname}
            setActiveNestedSidebar={setActiveNestedSidebar}
          />
          <FoldersList
            activeNestedSidebar={activeNestedSidebar}
            nestedItemsByCategory={nestedItemsByCategory}
            setActiveNestedSidebar={setActiveNestedSidebar}
            setNestedItemsByCategory={setNestedItemsByCategory}
          />
          <Separator />

          <NavItemList
            list={OTHER_SIDEBAR_ITEMS}
            pathname={pathname}
            setActiveNestedSidebar={setActiveNestedSidebar}
          />

          <Link
            href={'/import'}
            className={cn(
              'absolute bottom-2 w-full left-0',
              SIDEBAR_BTN,
              pathname === '/import' && ACTIVE_BTN,
            )}
            // @ts-ignore
            onClick={() => setActiveNestedSidebar()}
          >
            <UploadIcon className='w-5 h-5' />
            Import
          </Link>

          {/* <ThemeToggle className='ml-2 absolute bottom-0 right-2' /> */}
        </div>
        <LeftSidebarFooter user={user} />
      </nav>
    </div>
  )
}
