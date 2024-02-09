'use client'

import Link from 'next/link'
import Image from 'next/image'

import { Separator } from '@/components/ui/separator'

import { LeftSidebarFooter } from '@/components/left-sidebar/footer'
import { Folders } from '@/components/left-sidebar/folders'
import { TopSection } from '@/components/left-sidebar/top-section'

type SidebarNavProps = {
  className?: string
  user: any
}

const BRAND_NAME = 'Mind Trail'

export function LeftSidebar({ user }: SidebarNavProps) {
  return (
    <div className='min-h-screen flex flex-col'>
      {/* Container for both sidebars and main content */}
      {/* First sidebar */}
      <nav
        className='flex flex-col flex-1 justify-between w-[256px] flex-shrink-0
            border-r overflow-hidden transition-all duration-300 ease-in-out h-screen'
      >
        <div className='h-14 border-b flex items-center justify-center'>
          <Link href='/' className='flex gap-4 w-full px-4 py-2 self-center items-center'>
            <Image width={30} height={30} src='/icon-2.png' alt='Mind Trail' />
            {BRAND_NAME}
          </Link>
        </div>

        <TopSection />

        <Separator />

        <Folders />

        <div className='p-4 border-t border-gray-200'>
          <LeftSidebarFooter user={user} />
        </div>
      </nav>
    </div>
  )
}
