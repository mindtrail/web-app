'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { ThemeToggle } from '@/components/theme-toggle'
import { Separator } from '@/components/ui/separator'

import { LeftSidebarFooter } from '@/components/left-sidebar/footer'
import { Folders } from '@/components/left-sidebar/folders'
import { TopSection } from '@/components/left-sidebar/sidebar-top'
import { APP_NAME, SIDEBAR_FOLDERS } from '@/components/left-sidebar/constants'

type SidebarNavProps = {
  className?: string
  user: any
}

export function LeftSidebar({ user }: SidebarNavProps) {
  const pathname = usePathname()
  const [secondSidebar, setSecondSidebar] = useState<SidebarFoldersProps | undefined>()

  useEffect(() => {
    const subpath = pathname.split('/')[1]
    const openedSidebar = SIDEBAR_FOLDERS[subpath]

    setSecondSidebar(openedSidebar)
  }, [pathname])

  console.log(secondSidebar)

  return (
    <div className='min-h-screen flex flex-col'>
      <nav
        className='flex flex-col flex-1 justify-between w-[256px] flex-shrink-0
            border-r overflow-hidden transition-all duration-300 ease-in-out h-screen'>
        <div className='h-14 border-b flex items-center justify-center'>
          <Link href='/' className='flex gap-4 w-full px-4 py-2 self-center items-center'>
            <Image width={30} height={30} src='/icon-2.png' alt='Mind Trail' />
            {APP_NAME}
          </Link>
        </div>

        <div className='flex-1 flex flex-col relative'>
          <TopSection setSecondSidebar={setSecondSidebar} />
          <Separator />
          <Folders
            pathname={pathname}
            secondSidebar={secondSidebar}
            setSecondSidebar={setSecondSidebar}
          />
        </div>
        <div className='p-4 border-t'>
          <ThemeToggle />
          <LeftSidebarFooter user={user} />
        </div>
      </nav>
    </div>
  )
}
